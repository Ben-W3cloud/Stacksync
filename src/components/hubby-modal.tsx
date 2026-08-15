"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Coins, Zap } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type HubbyVariant = "intro" | "win";

const COPY: Record<
  HubbyVariant,
  { title: string; body: string; cta: string }
> = {
  intro: {
    title: "Hi, I'm Hubby!",
    body: "I'm your StackSync buddy. I'll guide you from web foundations all the way to shipping on-chain apps — one lesson, one quiz, one streak at a time. Pass quizzes to earn Sync-Coins and XP. Ready to sync your stack?",
    cta: "Let's go",
  },
  win: {
    title: "Nailed it!",
    body: "You passed the quiz. Hubby's proud of you — coins and XP are in the bank. Keep the streak alive!",
    cta: "Keep going",
  },
};

export function HubbyModal({
  open,
  onClose,
  variant = "intro",
  reward,
}: {
  open: boolean;
  onClose: () => void;
  variant?: HubbyVariant;
  reward?: { coins: number; xp: number };
}) {
  const copy = COPY[variant];

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
          className="relative -mt-16 h-32 w-32 rounded-full bg-zinc-950 p-2 shadow-lg ring-4 ring-card sm:-mt-20 sm:h-40 sm:w-40"
        >
          <Image
            src="/mascot.png"
            alt="Hubby the StackSync mascot"
            width={320}
            height={360}
            className="h-full w-full object-contain drop-shadow-[0_0_18px_rgba(6,182,212,0.4)]"
            priority
          />
        </motion.div>

        <h2 className="mt-4 text-2xl font-extrabold text-foreground">{copy.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{copy.body}</p>

        {variant === "win" && reward ? (
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-coin/15 px-3 py-1 text-sm font-bold text-yellow-700">
              <Coins className="h-4 w-4" />+{reward.coins}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold text-secondary">
              <Zap className="h-4 w-4" />+{reward.xp} XP
            </span>
          </div>
        ) : null}

        <Button
          onClick={onClose}
          variant={variant === "win" ? "secondary" : "primary"}
          size="lg"
          className="mt-6 w-full"
        >
          {copy.cta}
        </Button>
      </div>
    </Dialog>
  );
}
