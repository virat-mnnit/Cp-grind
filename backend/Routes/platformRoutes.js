import express from "express";
import {
    addPlatform,
    getPlatforms,
    getLivePlatformData,
    updatePlatform,
    removePlatform,
} from "../controllers/platformController.js";
import { protectRoute } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add",protectRoute, addPlatform); 
router.get("/:userId", protectRoute, getPlatforms); 
router.get("/:userId/getLivePlatformData", protectRoute, getLivePlatformData); 
router.put("/:platformId", protectRoute, updatePlatform); 
router.delete("/remove/:platformId",protectRoute, removePlatform); 

export default router;
