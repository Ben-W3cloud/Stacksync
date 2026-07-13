"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRACKS = [
  { name: "Web", color: "bg-primary/10 text-primary" },
  { name: "Backend", color: "bg-secondary/10 text-secondary" },
  { name: "Blockchain", color: "bg-success/10 text-success" },
  { name: "CS Core", color: "bg-streak/10 text-streak" },
  { name: "DevOps", color: "bg-muted text-muted-foreground" },
];

export function LandingHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-8 overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-14"
    >
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Flame className="h-4 w-4" />
          Web2 -&gt; Web3, one path
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Learn to ship <span className="text-primary">production</span> code and{" "}
          <span className="text-secondary">on-chain</span> apps.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          A gamified learning platform connecting CS foundations, modern web engineering, and
          blockchain development — with real progress, real rewards.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/learn">
            <Button size="lg">
              <Rocket className="h-5 w-5" />
              Start Learning
            </Button>
          </Link>
          <Link href="#pricing">
            <Button size="lg" variant="outline">
              See Pricing
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TRACKS.map((track) => (
            <span
              key={track.name}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${track.color}`}
            >
              {track.name}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative mx-auto flex h-72 w-full max-w-sm items-center justify-center rounded-[2rem] bg-zinc-950 p-4 shadow-xl sm:h-80"
      >
        <Image
          src="/mascot.png"
          alt="StackSync mascot"
          width={640}
          height={720}
          className="h-full w-auto object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]"
          priority
        />
      </motion.div>
    </motion.section>
  );
}
