import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express API!" });
});

export default app;
