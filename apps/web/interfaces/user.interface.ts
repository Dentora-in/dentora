export interface LogIn {
  email: string;
  password: string;
}

// export interface LogInForm {
//   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//   onGoogleLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
//   formData: LogIn;
//   setFormData: React.Dispatch<React.SetStateAction<LogIn>>;
//   loading: boolean;
//   context: string;
// }

export interface SignUp {
  name: string;
  email: string;
  password: string;
}

export interface signUpForm {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
  formData: SignUp;
  setFormData: React.Dispatch<React.SetStateAction<SignUp>>;
  loading: boolean;
}
