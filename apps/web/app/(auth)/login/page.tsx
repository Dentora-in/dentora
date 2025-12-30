"use client";

import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@dentora/auth/client";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      getSession().then((session: any) => {
        if (session?.data?.user) {
          router.push("/dashboard");
        }
      });
    }
  }, [router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-foreground">Dentora</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="bg-background border border-border/50 rounded-2xl p-8 shadow-sm">
          <LoginForm />
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
