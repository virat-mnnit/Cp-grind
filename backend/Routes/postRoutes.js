import express from "express";
import { protectRoute } from "../Middlewares/authMiddleware.js";
import {
	createPost,
	getFeedPosts,
	getPostById,
	createComment,
	likePost,
} from "../Controllers/postController.js";

const router = express.Router();

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.get("/:id", protectRoute, getPostById);
router.post("/:id/comment", protectRoute, createComment);
router.post("/:id/like", protectRoute, likePost);

export default router;