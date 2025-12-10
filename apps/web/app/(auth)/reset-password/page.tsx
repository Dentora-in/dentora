"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password";
import Image from "next/image";
import Dentor from "@/public/logo.png";
import { FullPageSpinner } from "@/components/child/full-page-spinner";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <ResetPasswordForm />
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
    </Suspense>
  );
}
