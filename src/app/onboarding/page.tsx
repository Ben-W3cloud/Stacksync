"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Blocks, Boxes, Cpu, Rocket, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cardHover } from "@/lib/motion";
import { cn } from "@/lib/utils";

const GOALS = [
  { id: "web", label: "Web Engineering", icon: Boxes, blurb: "Frontend, React, Next.js" },
  { id: "backend", label: "Backend", icon: Server, blurb: "APIs, databases, auth" },
  { id: "blockchain", label: "Blockchain", icon: Blocks, blurb: "Solidity, dApps, Web3" },
  { id: "cs", label: "CS Core", icon: Cpu, blurb: "Data structures, algorithms" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finish() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalTrack: selected }),
    });

    if (!response.ok) {
      setError("Could not save your goal. Try again.");
      setSubmitting(false);
      return;
    }

    await update({ onboarded: true });
    router.push("/learn");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col justify-center px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary">
          <Rocket className="h-5 w-5" />
          <span className="text-sm font-semibold">Welcome to StackSync</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold text-foreground">What&apos;s your main goal?</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a focus. You can learn any track anytime — this just sets your starting point.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {GOALS.map((goal) => (
            <button key={goal.id} onClick={() => setSelected(goal.id)} className="text-left">
              <Card
                className={cn(
                  "flex items-start gap-3 p-5",
                  cardHover,
                  selected === goal.id ? "ring-2 ring-primary" : "",
                )}
              >
                <goal.icon
                  className={cn(
                    "h-6 w-6",
                    selected === goal.id ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div>
                  <div className="font-bold text-foreground">{goal.label}</div>
                  <div className="text-sm text-muted-foreground">{goal.blurb}</div>
                </div>
              </Card>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={finish} disabled={!selected || submitting} size="lg">
            {submitting ? "Saving..." : "Start learning"}
          </Button>
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        </div>
      </motion.div>
    </main>
  );
}
