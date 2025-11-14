"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { useState } from "react";
import { authClient, signIn } from "@dentora/auth/client";
import { toast } from "@workspace/ui/components/sonner";
import { SignIn } from "@/types/user.types";
import { usePathname, useRouter } from "next/navigation";

export default function LoginPage() {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [formData, setFormData] = useState<SignIn>({
    email: "",
    password: "",
  });

  const context = pathname.startsWith("/u")
    ? "u"
    : pathname.startsWith("/c")
      ? "c"
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
          onError: (ctx) => {
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

  const login_with_google = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authClient.signIn.social(
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
          onError: (ctx) => {
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
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Dentora
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={manual_login}
              loading={loading}
              onGoogleLogin={login_with_google}
              context={context}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://avatars.githubusercontent.com/u/129583682?s=400&u=b22fad46a3197362ed0b03f5c4535f67ea2515ed&v=4"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
