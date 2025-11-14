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
import { signupSchema } from "@dentora/shared/zod"

export function SignupForm({
  className,
  onSubmit,
  loading,
  formData,
  setFormData,
  onGoogleLogin,
  context,
  errors,
  setErrors,
  ...props
}: React.ComponentProps<"form"> & signUpForm) {
  const validateField = (fieldName: string, value: string) => {
    const newFormData = { ...formData, [fieldName]: value };

    const result = signupSchema.safeParse(newFormData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Dentora"
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
          <FieldDescription>
            {errors?.name && <p className="text-red-500">{errors.name}</p>}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="dentora@gmail.com"
            required
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />
          <FieldDescription>
            {errors?.email ? (
              <p className="text-red-500">{errors.email}</p>
            ) : (
              "We'll use this to contact you. We will not share your email with anyone else."
            )}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <FieldDescription>
            {errors?.confirm_password ? (
              <p className="text-red-500">{errors.confirm_password}</p>
            ) : (
              "Must be at least 8 characters long."
            )}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={formData.confirm_password}
            onChange={(e) => {
              setFormData({ ...formData, confirm_password: e.target.value });
              validateField && validateField("confirm_password", e.target.value);
            }}
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">
            {loading ? <Spinner /> : "Create Account"}
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
            Sign up with Google
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href={`/${context}/login`}>Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
