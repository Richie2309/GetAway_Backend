import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from "morgan";
import connectDB from "./db";
import userRouter from "../router/userRoutes";
import errorHandler from "../middleware/errorMiddlewares";

// Load environment variables at the very beginning
dotenv.config();

// Connect to the database
connectDB();

const app = express()

// Middleware setup
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

//user routes
app.use('/api', userRouter)

// error middleware for handling errors
app.use(errorHandler)

export default app