import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

export const isDevelopmentMode = NODE_ENV === "dev";