"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not create account");
      setSubmitting(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/onboarding",
    });

    if (result?.error) {
      setError("Account created — please sign in.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="w-full p-8">
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="h-5 w-5" />
            <span className="text-sm font-semibold">Get started</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-foreground">Create your account</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <input
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Creating account..." : "Create account"}
            </Button>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/signin" className="font-semibold text-primary hover:underline">
              Sign in
            </a>
          </p>
        </Card>
      </motion.div>
    </main>
  );
}
