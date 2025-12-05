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
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    }
});