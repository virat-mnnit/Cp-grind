import User from "../Models/userModel.js";
import { uploadOnCloudinary } from "../lib/cloudinary.js";
import multer from "multer";
const upload = multer();

export const getProfile = async (req, res) => {
    try {
		const user=req.user;
		res.json(user);
	} catch (error) {
		console.error("Error in getProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
}

export const getUserProfile = async (req, res) => {
    try {
		const user = await User.findOne({ username: req.params.username }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getUserProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
}

export const updateProfile = async (req, res) => {
    try {
		console.log(req.body);
        const allowedFields = [
            "firstname",
            "lastname",
            "username",
            "phone",
            "dob",
            "location",
            "bio",
            "academics", // Ensure academics is passed correctly as an object or array
        ];

        // Prepare the data that needs to be updated
        const updatedData = {};
		// If academics is a stringified JSON, parse it
        if (req.body.academics) {
            updatedData.academics = JSON.parse(req.body.academics);
        }
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updatedData[field] = req.body[field];
            }
        }

        // If a profile picture is provided, upload to Cloudinary and save the URL
        if (req.file) {
			const cloudinaryUrl = await uploadOnCloudinary(req.file.path);
			if (cloudinaryUrl) {
			  updatedData.profilePicture = cloudinaryUrl;
			}
		  }

        // Update the user with the new data
        const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
            "-password"
        );

        // Send response with the updated user data (excluding password)
        res.status(200).json({
            message: "Profile updated successfully",
            user: user,
        });
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
