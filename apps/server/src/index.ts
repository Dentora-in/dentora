import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import router from "./route";
import google_route from "./routes/google.route";
import cors from "cors";
import rateLimit from "express-rate-limit";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    error: true,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

const port = process.env.BACKEND_PORT || 5000;

app.get("/health", (req: Request, res: Response) => {
    return res.status(200).json({
        status: "ok",
        message: "Server is healthy",
    });
});

app.use("/v0/", router);
app.use("/g/", google_route);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({
        error: true,
        message: err.message || "Something went wrong",
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});