import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';
import authRoutes from './Routes/authRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import friendRoutes from './Routes/friendRoutes.js'
import notificationRoutes from './Routes/notificationRoutes.js'

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/friends', friendRoutes);
app.use('/api/v1/notifications', notificationRoutes);



try {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on ${process.env.PORT}`);
        connectDB();
    });
} catch (err) {
    console.error('Error starting the server:', err.message);
}