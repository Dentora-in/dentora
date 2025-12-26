"use client";

import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import Dentor from "@/public/logo.png";
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
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
