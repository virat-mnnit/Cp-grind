import User from "../Models/userModel.js";
export const addFriend = async (req, res) => {
    try {
		const newFriend = await User.findOne({ username: req.params.username }).select("-password");
        if(!newFriend){
            return res.status(404).json({
                message: "username not found"
            })
        }
		const user = req.user;

		if (newFriend._id.toString() === user._id.toString()) {
			return res.status(400).json({ message: "You can't add yourself" });
		}

		if (user.friends.includes(newFriend._id)) {
			return res.status(400).json({ message: "You are already connected" });
		}
        user.friends = [...user.friends, newFriend._id];
        newFriend.friends = [...newFriend.friends, user._id];

        await user.save();
        await newFriend.save();

		res.status(201).json({ message: "Friend added" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

export const getUserFriends = async (req, res) =>{
    try {
        const userId = req.user._id;

		const user = await User.findById(userId).populate(
			"friends",
			"firstname lastname username profilePicture "
		);
        res.json(user.friends);
    } catch (error) {
        console.error("Error in getUserfriends controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}