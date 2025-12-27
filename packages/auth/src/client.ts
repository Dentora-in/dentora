import { createAuthClient } from "better-auth/client";
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "./auth";
export { fromNodeHeaders, toNodeHandler } from "better-auth/node";
export type { Session, User } from "better-auth";
export type { auth };

const authClient: any = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [customSessionClient<typeof auth>()],
});

export const {
  signUp,
  signIn,
  signOut,
  getSession,
  useSession,
  resetPassword,
  forgetPassword,
  requestPasswordReset,
} = authClient;
