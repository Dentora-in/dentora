import { prisma } from "@dentora/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
export { fromNodeHeaders } from "better-auth/node";
import { loadEmailTemplate } from "@dentora/shared/template-loader";
import { emailQueue } from "@dentora/shared/queue";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            console.log(`User: ${user.email}`);
            console.log(`Reset link: ${url}`);

            const html = loadEmailTemplate("reset-password.html", {
                email: user.email,
                reset_link: url,
            });

            await emailQueue.add("reset-password", {
                to: user.email,
                subject: "Reset Your Dentora Password",
                html,
                text: `Reset your password using this link: ${url}`,
            });
        },
        onPasswordReset: async ({ user }, request) => {
            const html = loadEmailTemplate("password-reset-success.html", {
                name: user.name,
                email: user.email
            });

            await emailQueue.add("password-reset-success", {
                to: user.email,
                subject: "Your Password Was Reset Successfully",
                html,
                text: `Your password was successfully changed.`,
            });
        },
    },
    secret: process.env.BETTER_AUTH_SECRET,
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
    },
    plugins: [
        customSession(async ({ user, session }) => {
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { role: true }
            });

            return {
                user: {
                    ...user,
                    role: dbUser?.role,
                },
                session,
            };
        }),
    ],
});