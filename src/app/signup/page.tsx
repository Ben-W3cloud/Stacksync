"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Lock, Mail, User } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(values: Record<string, string>) {
    setError(null);
    setSuccess(null);
    const name = values.name?.trim() ?? "";
    const email = values.email?.trim() ?? "";
    const password = values.password ?? "";

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(data?.error ?? "Could not create account");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/onboarding",
    });

    if (result?.error) {
      setError("Account created, but automatic sign-in failed. Please sign in.");
    }
  }

  return (
    <AuthShell
      variant="signup"
      eyebrow="Start your journey"
      title="Create your account"
      subtitle="A few details, then you’re in. No credit card, no setup."
      fields={[
        {
          name: "name",
          label: "Full name",
          type: "text",
          placeholder: "Ada Lovelace",
          icon: User,
          required: true,
          autoComplete: "name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@stacksync.app",
          icon: Mail,
          required: true,
          autoComplete: "email",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Min. 8 characters",
          icon: Lock,
          required: true,
          minLength: 8,
          autoComplete: "new-password",
        },
      ]}
      submitLabel="Create account"
      submittingLabel="Creating account…"
      error={error}
      success={success}
      onSubmit={onSubmit}
      footer={
        <span>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </span>
      }
    />
  );
}
