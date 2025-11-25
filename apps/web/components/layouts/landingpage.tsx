"use client";

import { Button } from "@workspace/ui/components/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function Landingpage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex items-center justify-center min-h-svh">
      <section className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-9xl font-extrabold">Dentora</h1>
        <h2 className="text-2xl font-bold text-muted-foreground">
          Smart Dental Management System
        </h2>

        <div className="flex gap-3 mt-4">
          <Button
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            Toggle Theme
          </Button>

          <Button size="sm" onClick={() => router.push("/user/login")}>
            Log In
          </Button>

          <Button size="sm" onClick={() => router.push("/user/signup")}>
            Sign Up
          </Button>
        </div>
      </section>
    </main>
  );
}
