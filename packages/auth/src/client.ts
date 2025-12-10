import { createAuthClient } from "better-auth/client";
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "./auth";
export { fromNodeHeaders, toNodeHandler } from "better-auth/node";
export type { Session, User } from "better-auth";

const NEXT_PUBLIC_BETTER_AUTH_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

console.log("process.env.NEXT_PUBLIC_BETTER_AUTH_URL", NEXT_PUBLIC_BETTER_AUTH_URL);

const authClient: any = createAuthClient({
  baseURL: NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [customSessionClient<typeof auth>()],
});

export const { signUp, signIn, signOut, getSession, useSession, resetPassword } = authClient;