
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
		},
        lastname: {
			type: String,
			required: true,
		},
		email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profilePicture: {
			type: String,
			default: "",
		},
		dob: {
			type: Date,
		},
		phone: {
			type: Number,
		},
		academics: {
			institution: String,
			degree: String,
			graduationYear: Date,
		},
		bio: {
			type: String,
			default: "",
		},
		location: {
			type: String,
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
