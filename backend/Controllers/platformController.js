import Platform from "../Models/platformModel.js";
import axios from "axios";

export const addPlatform = async (req, res) => {
    try {
       
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
            try {
                switch (platform.platformName.toLowerCase()) {
                    case "codeforces":
                        const response = await axios.get(
                            `https://codeforces.com/api/user.info?handles=${platform.platformUsername}`
                        );
                        return response.data?.result?.[0] || { error: "No data found" }; // Extract data
                    default:
                        return { error: `Platform ${platform.platformName} is not supported.` };
                }
            } catch (error) {
                console.error(`Error fetching data for ${platform.platformName}:`, error.message);
                throw error;
            }
        };

        const liveDataPromises = platforms.map(async (platform) => {
            try {
                const liveData = await fetchLiveData(platform);
                return {
                    platformName: platform.platformName,
                    platformUsername: platform.platformUsername,
                    liveData: liveData,
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
        console.error("Error fetching live platform data:", error.message);
        res.status(500).json({ message: "Server error", error });
    }
};


