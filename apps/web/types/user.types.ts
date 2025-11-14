
export type SignIn = {
    email: string;
    password: string;
}

export type SigInForm = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onGoogleLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
    formData: SignIn;
    setFormData: React.Dispatch<React.SetStateAction<SignIn>>;
    loading: boolean;
    context: string;
}