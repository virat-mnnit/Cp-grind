import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import zod from 'zod';
import User from '../Models/userModel.js';
import nodemon from 'nodemon';

const signupBody = zod.object({
    firstname: zod.string().max(100).min(3),
    lastname: zod.string().max(100).min(3),
    email: zod.string().email(),
    username: zod.string().min(3).max(50),
    password: zod.string().min(8).max(50)
})

export const signup = async (req, res) => {
    try{
        const { success } = signupBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
            message: "Invalid inputs",
            });
        }
        const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
        return res.status(409).json({
        message: "Email already taken",
        });
    }

    const { email, username, firstname, lastname, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        email,
        firstname,
        lastname,
        username,
        password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });

            res.status(201).json({ message: "User registered successfully" });
        } catch(error){
            console.log("Error in signupController: ", error.message);
		    res.status(500).json({ message: "Error in signupController" });
        }
}

const loginBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8).max(50)
})

export const login = async (req, res) => {
    try {
        const { success } = loginBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
            message: "Invalid inputs",
            });
        }
        const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(409).json({
        message: "No user found",
        });
    }
    const { password } = req.body;

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(409).json({
            message: "No user found",
        });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

           
            res.cookie("jwt", token, {
                maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
              });
              
            res.status(201).json({ message: "User loggedin successfully" });

    } catch(error){
        console.log("Error in loginController: ", error.message);
        res.status(500).json({ message: "Error in loginController" });
    }
}

export const logout = (req, res) => {
	res.clearCookie("jwt");
	res.json({ message: "Logged out successfully" });
};