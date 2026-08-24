"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { login } from "@/src/api/auth.api";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setError("");
    setIsSubmitting(true);

    try {
      await login(values.email, values.password);
      router.push("/");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="meta-font text-foreground mb-2 block text-xs font-semibold"
            htmlFor="email"
          >
            Email
          </label>
          <div className="group bg-surface-1 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
            <Mail
              aria-hidden="true"
              className="text-text-muted mr-3"
              size={17}
            />
            <input
              className="text-foreground placeholder:text-text-muted/50 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              id="email"
              placeholder="your@email.com"
              type="email"
              {...registerField("email", {
                required: "Please enter your email address.",
              })}
            />
          </div>
          {errors.email && (
            <p className="text-error mt-2 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              className="meta-font text-foreground text-xs font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              className="meta-font text-primary hover:text-primary-soft text-xs font-semibold"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <div className="bg-surface-1 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
            <LockKeyhole
              aria-hidden="true"
              className="text-text-muted mr-3"
              size={17}
            />
            <input
              className="text-foreground placeholder:text-text-muted/50 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              {...registerField("password", {
                required: "Please enter your password.",
              })}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-text-muted hover:text-primary-soft ml-2 transition"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-error mt-2 text-xs">{errors.password.message}</p>
          )}
        </div>

        <label className="text-text-muted flex items-center gap-3 text-sm">
          <input
            className="accent-primary border-outline-strong bg-surface-1 h-4 w-4 rounded"
            type="checkbox"
            {...registerField("remember")}
          />
          Remember me
        </label>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          className="meta-font bg-primary text-primary-ink hover:bg-primary-soft focus-visible:outline-primary-soft flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-3"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
          <ArrowRight size={17} />
        </button>
      </form>

      <p className="text-text-muted mt-8 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          className="text-primary hover:text-primary-soft font-semibold"
          href="/register"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
