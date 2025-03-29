import Platform from "../Models/platformModel.js";
import axios from "axios";

export const addPlatform = async (req, res) => {
    try {

        console.log("Request received at /add");
        console.log("Request Body:", req.body);
        console.log("Authenticated User:", req.user);
        
        const { platformName, platformUsername } = req.body;
        const userId = req.user._id;

        const existingPlatform = await Platform.findOne({
            user: userId,
            platformName,
        });

        if (existingPlatform) {
            return res.status(400).json({ message: "Platform already exists." });
        }

        const platform = new Platform({
            user: userId,
            platformName,
            platformUsername,
        });

        await platform.save();

        res.status(201).json({ message: "Platform added successfully", platform });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const getPlatforms = async (req, res) => {
    try {
        const userId = req.params.userId;

        const platforms = await Platform.find({ user: userId });

        if (!platforms.length) {
            return res.status(404).json({ message: "No platforms found for this user." });
        }

        res.status(200).json(platforms);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const updatePlatform = async (req, res) => {
    try {
        const platformId = req.params.platformId;
        const updates = req.body;
        const platform = await Platform.findById(platformId);
        if (!platform) {
            return res.status(404).json({ message: "Platform not found." });
        }
        if(platform.user.toString() !== req.user._id.toString()){
            return res.status(401).json({
                msg: "You are not authorized to upadte data"
            })
        }
        platform.platformUsername=updates.platformUsername;
        await platform.save();


        res.status(200).json({ message: "Platform updated successfully", platform });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getLivePlatformData = async (req, res) => {
    try {
        const userId = req.params.userId;

        const platforms = await Platform.find({ user: userId });

        if (!platforms.length) {
            return res.status(404).json({ message: "No platforms found for this user." });
        }

        const fetchLiveData = async (platform) => {
            switch (platform.platformName.toLowerCase()) {
                case "codeforces":
                    return axios.get(`https://codeforces.com/api/user.info?handles=${platform.platformUsername}`);
                case "leetcode":
                    return axios.get(`https://leetcode-stats-api.herokuapp.com/${platform.platformUsername}`);
                case "codechef":
                    return axios.get(`https://api.codechef.com/users/${platform.platformUsername}`);
                default:
                    return null;
            }
        };

        const liveDataPromises = platforms.map(async (platform) => {
            try {
                const liveData = await fetchLiveData(platform);
                return {
                    platformName: platform.platformName,
                    platformUsername: platform.platformUsername,
                    liveData: liveData?.result || {},
                };
            } catch (error) {
                return {
                    platformName: platform.platformName,
                    platformUsername: platform.platformUsername,
                    error: `Failed to fetch live data: ${error.message}`,
                };
            }
        });

        const livePlatformData = await Promise.all(liveDataPromises);

        res.status(200).json({ message: "Live platform data fetched successfully", livePlatformData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

