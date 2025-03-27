import cloudinary from "../lib/cloudinary.js";
import User from "../Models/userModel.js";

export const getProfile = async (req, res) => {
    try {
		const user = await User.findOne({ username: req.params.username }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
}

export const updateProfile = async (req, res) => {
    try {
		const allowedFields = [
			"firstname",
            "lastname",
            "username",
            "password",
			"profilePicture",
		];

        if(req.params.username!=req.user.username){
            return res.status(403).json({
                message: "Not permitted to update other user's profile"
            })
        }

		const updatedData = {};

		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}
        if(req.body.profilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture = result.secure_url;
        }

		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
}