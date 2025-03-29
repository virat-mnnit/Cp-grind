import express from "express";
import {
    addPlatform,
    getPlatforms,
    getLivePlatformData,
    updatePlatform
} from "../controllers/platformController.js";
import { protectRoute } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", addPlatform); 
router.get("/:userId", protectRoute, getPlatforms); 
router.get("/:userId/getLivePlatformData", protectRoute, getLivePlatformData); 
router.put("/:platformId", protectRoute, updatePlatform); 

export default router;
