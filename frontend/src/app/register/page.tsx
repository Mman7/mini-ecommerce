import { AuthPage, AuthMode } from "@/src/components/auth/AuthPage";

export default function RegisterPage() {
  return <AuthPage mode={AuthMode.REGISTER} />;
}
