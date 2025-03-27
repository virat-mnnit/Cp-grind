import mongoose from 'mongoose';
 
const platformSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        platformName: {
            type: String,
            required: true,
        },

        platfromUsername: {
            type: String,
            required: true,
        },

        totalContests: {
            type: number,
        },

        totalQuestions: {
            type: number,
        },

        curRating: {
            type: number,
        },

        maxRating: {
            type: number,
        },
        joinedOn: {
            type: Date,
        }

    }
);

const Platform = new mongoose.Model("Platform", platformSchema);

export default Platform;