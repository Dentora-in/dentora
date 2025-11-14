import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@dentora/database";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
    },
    // TODO : need to add the mailing service sapartly
    // emailVerification: {
    //     sendOnSignUp: true,
    //     autoSignInAfterVerification: true,
    //     sendVerificationEmail: async ({ user, url, token }, request) => {
    //         // Use your email sending service here, e.g. SendGrid, Resend, etc.
    //         await yourEmailService.send({
    //             to: user.email,
    //             subject: "Please verify your email",
    //             html: `Click this link to verify: <a href="${url}">${url}</a>`,
    //         });
    //     },
    //     expiresIn: 60 * 60
    // },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    }
});