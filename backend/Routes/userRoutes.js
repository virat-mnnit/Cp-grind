import express from 'express';
import upload from '../Middlewares/multerMiddleware.js';
import { protectRoute } from '../Middlewares/authMiddleware.js';
import { getUserProfile, updateProfile, getProfile} from '../Controllers/userController.js';


const router = express.Router();
router.get('/', protectRoute, getProfile);
router.get('/:username', protectRoute, getUserProfile);
router.put("/update", protectRoute, upload.single("profilePicture"), updateProfile);



export default router;