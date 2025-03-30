import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/database";
import routes from "./routes/index.routes";
import { errorHandler } from "./middlewares/error_handler";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Vercel Express! - Bintang' });
});

app.use('/API/v1', routes);
app.use(errorHandler)
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});


export default app;
