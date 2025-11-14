"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import { LogInForm } from "@/interfaces/user.interface";

export function LoginForm({
  className,
  onSubmit,
  loading,
  formData,
  setFormData,
  onGoogleLogin,
  context,
  ...props
}: React.ComponentProps<"form"> & LogInForm) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {context === "u" ? "User" : "Clinic"} Login
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="dentora@gmail.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href={`/${context}/forgot`}
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          {/* TODO: add nice google svg, should match with the theme*/}
          <Button variant="outline" type="button" onClick={onGoogleLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-2"
            >
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385..."
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a
              href={`/${context}/signup`}
              className="underline underline-offset-4"
            >
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
