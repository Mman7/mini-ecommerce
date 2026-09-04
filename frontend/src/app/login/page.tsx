import { AuthMode, AuthPage } from "@/src/components/auth/AuthPage";

export default function LoginPage() {
  return <AuthPage mode={AuthMode.LOGIN} />;
}
