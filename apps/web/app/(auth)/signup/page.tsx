"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { ThemeToggler } from "@/components/child/theme-toggler";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@/interfaces/user.interface";
import { signIn, signUp, getSession } from "@dentora/auth/client";
import { toastService } from "@/lib/toast";
import { handleAuthError } from "@/lib/error-handler";
import { signupSchema } from "@dentora/shared/zod";
import { useEffect } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignUp>({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      getSession().then((session: any) => {
        if (session?.data?.user) {
          router.push("/dashboard");
        }
      });
    }
  }, [router]);

  const manual_signup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signupSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const mapped: Record<string, string> = Object.entries(fieldErrors).reduce(
        (acc, [key, val]) => {
          acc[key] = Array.isArray(val)
            ? (val[0] ?? "Invalid value")
            : "Invalid value";
          return acc;
        },
        {} as Record<string, string>,
      );
      const firstErr = Object.values(mapped)[0];
      if (firstErr) toastService.warning(firstErr);
      return;
    }

    try {
      setLoading(true);
      await signUp.email(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toastService.success("Successfully signed up!");
            setLoading(false);
            router.push("/dashboard");
          },
          onError: (ctx: any) => {
            handleAuthError(ctx.error, "signup");
          },
        },
      );
    } catch (err) {
      handleAuthError(err, "signup");
    } finally {
      setLoading(false);
    }
  };

  const with_google = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signIn.social(
        {
          provider: "google",
          callbackURL: "/?google_oauth=1",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            router.push("/dashboard");
          },
          onError: (ctx: any) => {
            handleAuthError(ctx.error, "signup with Google");
          },
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Theme toggle - top right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggler />
      </div>

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
          <SignupForm
            onSubmit={manual_signup}
            loading={loading}
            setFormData={setFormData}
            formData={formData}
            onGoogleLogin={with_google}
          />
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
