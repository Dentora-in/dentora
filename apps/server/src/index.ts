import express, { Request, Response, NextFunction } from "express";
import router from "./route";
import google_route from "./routes/google.route";
import { prisma } from "@dentora/database";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
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