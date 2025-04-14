import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';
import authRoutes from './Routes/authRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import friendRoutes from './Routes/friendRoutes.js'
import notificationRoutes from './Routes/notificationRoutes.js'
import platformRoutes from './Routes/platformRoutes.js'
import postRoutes from './Routes/postRoutes.js'


const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5175",  
  credentials: true, // Allows cookies to be sent
}));



app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/friends', friendRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/platforms', platformRoutes);
app.use('/api/v1/posts', postRoutes);


try {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on ${process.env.PORT}`);
        connectDB();
    });
} catch (err) {
    console.error('Error starting the server:', err.message);
}