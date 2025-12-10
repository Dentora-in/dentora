import { prisma } from "@dentora/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
export { fromNodeHeaders } from "better-auth/node";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            console.log("🚀 Password reset requested!");
            console.log(`User: ${user.email}`);
            console.log(`Reset link: ${url}?token=${token}`);

            // void sendEmail({
            //     to: user.email,
            //     subject: "Reset your password",
            //     text: `Click the link to reset your password: ${url}`,
            // });
        },
        onPasswordReset: async ({ user }, request) => {
            console.log(`✅ Password for user ${user.email} has been reset.`);
        },
    },
    secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET,
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    }
});