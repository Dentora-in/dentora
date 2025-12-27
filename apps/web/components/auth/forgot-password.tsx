"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { toastService } from "@/lib/toast";
import { handleAuthError } from "@/lib/error-handler";
import { requestPasswordReset } from "@dentora/auth/client";

export function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toastService.warning("Email is required");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await requestPasswordReset({
        email: trimmedEmail,
        redirectTo: "/reset-password",
      });

      if (error) {
        toastService.error(handleAuthError(error, "request password reset"));
      } else if (data?.status) {
        toastService.success(
          "Password reset link sent. Redirecting to login...",
        );
        router.push("/login");
      } else {
        toastService.error(data?.message || "Unable to process your request.");
      }
    } catch (err: any) {
      toastService.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          Enter Email<span className="text-destructive">*</span>
        </label>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
}
