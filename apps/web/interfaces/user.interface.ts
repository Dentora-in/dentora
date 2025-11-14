export interface LogIn {
  email: string;
  password: string;
}

export interface LogInForm {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
  formData: LogIn;
  setFormData: React.Dispatch<React.SetStateAction<LogIn>>;
  loading: boolean;
  context: string;
}

export interface SignUp {
  // add fields when needed
}
