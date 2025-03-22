const express = require("express");
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// USER SIGN UP
const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({ username: req.body.username });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already taken",
    });
  }

  const { username, firstName, lastName, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    firstName,
    lastName,
    password: hashedPassword,
  });

  // ----- Create new account ------
  await Account.create({
    userId: newUser._id
  // Default balance (adjust as needed)
  });

  res.status(201).json({
    message: "User created successfully",
  });
});

// USER LOGIN IN
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/login", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Wrong credentials!" });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    token: token,
  });
});

module.exports = router;
