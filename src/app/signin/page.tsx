"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setError("Invalid credentials");
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
            <Flame className="h-5 w-5" />
            <span className="text-sm font-semibold">Welcome back</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-foreground">Sign in</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
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
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in..." : "Continue"}
            </Button>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No account yet?{" "}
            <a href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </a>
          </p>
        </Card>
      </motion.div>
    </main>
  );
}
