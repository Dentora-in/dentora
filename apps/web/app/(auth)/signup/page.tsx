"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "@/components/auth/signup-form";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@/interfaces/user.interface";
import { signIn, signUp } from "@dentora/auth/client";
import { toast } from "@workspace/ui/components/sonner";
import Image from "next/image";
import Link from "next/link";
import Dentor from "@/public/logo.png";
import { signupSchema } from "@dentora/shared/zod";

export default function SignupPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignUp>({
    name: "",
    email: "",
    password: "",
  });

  const manual_login = async (e: React.FormEvent) => {
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
        {} as Record<string, string>
      );
      const firstErr = Object.values(mapped)[0];
      if (firstErr) toast.warning(firstErr);
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
            toast.success("Successfully signed in!");
            setLoading(false);
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
      toast.error("Sign up failed. Check console for details.");
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
            <SignupForm
              onSubmit={manual_login}
              loading={loading}
              setFormData={setFormData}
              formData={formData}
              onGoogleLogin={with_google}
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
