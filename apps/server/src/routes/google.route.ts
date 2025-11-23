
import { Router, Request, Response } from "express";
import { google } from "googleapis";
import * as dotenv from "dotenv";
dotenv.config();

const google_route: Router = Router();

// to generate the GOOGLE_REFRESH_TOKEN
// DOCS: https://developers.google.com/workspace/calendar/api/quickstart/nodejs

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
);

const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
];

console.log("=====================================================")
console.log(`Your redirect url from .env is ${process.env.GOOGLE_REDIRECT_URI}`);
console.log(`http://localhost:3001/g/auth/google/callback`);
console.log("=====================================================")

// Step 1: Google login URL
google_route.get("/auth/google", (req: Request, res: Response) => {
    console.log("hit from funtion 1 - /auth/google");
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES,
    });

    res.redirect(url);
});

// Step 2: Callback
google_route.get("/auth/google/callback", async (req: Request, res: Response) => {
    console.log("hit from funtion 2 - /auth/google/callback");
    const code = req.query.code;

    if (!code || typeof code !== "string") {
        return res.status(400).send("Invalid code parameter");
    }

    const { tokens } = await oauth2Client.getToken(code);

    console.log("Google OAuth Tokens:", tokens);

    res.send("Success! Check your terminal for tokens.");
});

export default google_route;
