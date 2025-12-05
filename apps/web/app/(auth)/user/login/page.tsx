"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useState } from "react";
import { signIn } from "@dentora/auth/client";
import { toast } from "@workspace/ui/components/sonner";
import { LogIn } from "@/interfaces/user.interface";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Dentor from "@/public/logo.png";

export default function LoginPage() {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [formData, setFormData] = useState<LogIn>({
    email: "",
    password: "",
  });

  const context = pathname.startsWith("/user")
    ? "user"
    : pathname.startsWith("/client")
      ? "client"
      : "unknown";

  const manual_login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signIn.email(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("Successfully signed in!");
            setLoading(false);
            // router.push(context === "u" ? "/dashboard" : "/clinic/dashboard");
            // TODO : push to designated place
            router.push("/");
          },
          onError: (ctx: any) => {
            console.error(ctx.error.message);
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (err) {
      console.error(err);
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
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            setLoading(false);
            // router.push(context === "u" ? "/dashboard" : "/clinic/dashboard");
            // TODO : push to designated place
            router.push("/");
          },
          onError: (ctx: any) => {
            console.error(ctx.error.message);
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={manual_login}
              loading={loading}
              onGoogleLogin={with_google}
              context={context}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={Dentor}
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
