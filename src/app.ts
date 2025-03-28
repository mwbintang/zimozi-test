import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/database";
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
connectDB();

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express API!" });
});

export default app;
