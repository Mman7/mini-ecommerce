"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { register } from "@/src/api/auth.api";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    setError("");
    setIsSubmitting(true);

    try {
      await register(values.name, values.email, values.password);
      router.push("/");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div>
          <label
            className="meta-font text-text-muted mb-2 block text-xs font-semibold"
            htmlFor="name"
          >
            Full Name
          </label>
          <div className="bg-surface-3 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
            <UserRound
              aria-hidden="true"
              className="text-text-muted mr-3"
              size={17}
            />
            <input
              className="text-foreground placeholder:text-text-muted/45 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              id="name"
              placeholder="E.g., Satoru Gojo"
              type="text"
              {...registerField("name", {
                required: "Please enter your full name.",
              })}
            />
          </div>
          {errors.name && (
            <p className="text-error mt-2 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            className="meta-font text-text-muted mb-2 block text-xs font-semibold"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="bg-surface-3 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
            <Mail
              aria-hidden="true"
              className="text-text-muted mr-3"
              size={17}
            />
            <input
              className="text-foreground placeholder:text-text-muted/45 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              id="email"
              placeholder="you@example.com"
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
          <label
            className="meta-font text-text-muted mb-2 block text-xs font-semibold"
            htmlFor="password"
          >
            Password
          </label>
          <div className="bg-surface-3 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
            <LockKeyhole
              aria-hidden="true"
              className="text-text-muted mr-3"
              size={17}
            />
            <input
              className="text-foreground placeholder:text-text-muted/45 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              id="password"
              placeholder="Create a password"
              {...registerField("password", {
                required: "Please create a password.",
              })}
              type={showPassword ? "text" : "password"}
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
      </div>

      {error && <p className="text-error mt-5 text-sm">{error}</p>}

      <button
        className="meta-font bg-primary text-primary-ink hover:bg-primary-soft focus-visible:outline-primary-soft mt-7 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold tracking-[0.12em] uppercase transition focus-visible:outline-2 focus-visible:outline-offset-3"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
        <ArrowRight size={17} />
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="bg-outline-strong/40 h-px flex-1" />
        <span className="meta-font text-text-muted text-[10px] tracking-[0.25em] uppercase">
          or
        </span>
        <div className="bg-outline-strong/40 h-px flex-1" />
      </div>

      <p className="text-text-muted text-center text-sm">
        Already a collector?{" "}
        <Link
          className="text-primary hover:text-primary-soft font-semibold"
          href="/login"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
