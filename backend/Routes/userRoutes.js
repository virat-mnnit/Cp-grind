import express from 'express';

import { protectRoute } from '../Middlewares/authMiddleware.js';
import { getProfile, updateProfile } from '../Controllers/userController.js';


const router = express.Router();

router.get('/:username', protectRoute, getProfile);
router.put('/:username/update', protectRoute, updateProfile);


export default router;