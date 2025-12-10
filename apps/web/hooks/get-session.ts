import { getSession, Session, User } from "@dentora/auth/client";
import { useEffect, useState } from "react";

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data } = await getSession();

        setSession(data?.session ?? null);
        setUser(data?.user ?? null);
      } catch (err) {
        console.error(err);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { user, session, isLoading };
}
