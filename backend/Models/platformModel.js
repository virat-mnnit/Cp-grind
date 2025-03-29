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
        platformUsername: {
            type: String, 
            required: true,
        },
        totalContests: {
            type: Number, 
        },
        totalQuestions: {
            type: Number, 
        },
        curRating: {
            type: Number, 
        },
        maxRating: {
            type: Number, 
        },
        joinedOn: {
            type: Date,
        },
    },
    { timestamps: true } 
);

const Platform = mongoose.model("Platform", platformSchema); 

export default Platform;
