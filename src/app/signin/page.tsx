"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(values: Record<string, string>) {
    setError(null);
    setSuccess(null);
    const email = values.email?.trim() ?? "";
    const password = values.password ?? "";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setError("Invalid credentials. Try again.");
    }
  }

  return (
    <AuthShell
      variant="signin"
      eyebrow="Welcome back"
      title="Sign in to StackSync"
      subtitle="Pick up your streak, finish a lesson, claim your XP."
      fields={[
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
          placeholder: "Your password",
          icon: Lock,
          required: true,
          autoComplete: "current-password",
        },
      ]}
      submitLabel="Continue"
      submittingLabel="Signing in…"
      error={error}
      success={success}
      onSubmit={onSubmit}
      footer={
        <span>
          No account yet?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </span>
      }
    />
  );
}
