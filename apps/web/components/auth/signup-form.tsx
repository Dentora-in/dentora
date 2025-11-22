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
import { signUpForm } from "@/interfaces/user.interface";
import { Spinner } from "@workspace/ui/components/spinner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function SignupForm({
  className,
  onSubmit,
  loading,
  formData,
  setFormData,
  onGoogleLogin,
  context,
  ...props
}: React.ComponentProps<"form"> & signUpForm) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-center text-xl font-semibold">
            Create your Dentora account
          </h1>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            type="name"
            placeholder="dentora"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Field>

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
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Sign Up"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" onClick={onGoogleLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#EA4335"
                d="M12 11.5v2.9h4.1c-.2 1.2-1.2 3.6-4.1 3.6-2.5 0-4.5-2.1-4.5-4.7s2-4.7 4.5-4.7c1.4 0 2.3.6 2.8 1.1l1.9-1.9C15.4 6.7 13.9 6 12 6 8.1 6 5 9.1 5 13s3.1 7 7 7c4 0 6.6-2.8 6.6-6.8 0-.5 0-.8-.1-1.2H12z"
              />
              <path
                fill="#34A853"
                d="M5 13c0 3.9 3.1 7 7 7 2.1 0 3.7-.8 4.8-2.1l-1.9-1.9c-.7.5-1.6.9-2.9.9-2.3 0-4.2-1.6-4.7-3.8H5z"
              />
            </svg>
            Continue with Google
          </Button>

          <FieldDescription className="text-center">
            Already have an account?{" "}
            <a
              href={`/${context}/login`}
              className="underline underline-offset-4"
            >
              Log in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
