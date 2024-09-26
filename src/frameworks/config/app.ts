import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from "morgan";
import connectDB from "./db";
import userRouter from "../router/userRoutes";
import adminRouter from "../router/adminRoutes";
import errorHandler from "../middleware/errorMiddlewares";
import tokenRoutes from "../router/tokenRoutes";

// Load environment variables at the very beginning
dotenv.config();

// Connect to the database
connectDB();

const app = express()

// Middleware setup
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

//token route
app.use('/refresh-token', tokenRoutes)

//user routes
app.use('/api', userRouter)
app.use('/api/admin', adminRouter)

// error middleware for handling errors
app.use(errorHandler)

export default app