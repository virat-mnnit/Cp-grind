import express from 'express';
import { login, logout, signup } from '../Controllers/authControllers.js';
import { protectRoute } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',protectRoute, logout);

export default router;