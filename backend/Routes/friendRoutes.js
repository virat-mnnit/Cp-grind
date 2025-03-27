import express from 'express';
import { protectRoute } from '../Middlewares/authMiddleware.js';
import { addFriend, getUserFriends } from '../Controllers/friendController.js';

const router = express.Router();

router.post('/add/:username', protectRoute, addFriend);
router.get('/', protectRoute, getUserFriends);

export default router;