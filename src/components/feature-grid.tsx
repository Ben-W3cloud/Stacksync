"use client";

import { motion } from "framer-motion";
import { Coins, GitBranch, Layers, Sparkles } from "lucide-react";
import { fadeUpInView, springDefault } from "@/lib/motion";

export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div className="max-w-2xl" {...fadeUpInView()}>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built to keep you moving
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A curriculum, a reward loop, and a dashboard that make progress feel physical.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={springDefault}
            className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-8 sm:p-10 md:row-span-2"
          >
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/25">
              <Layers className="h-6 w-6" />
            </span>
            <h3 className="relative mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Hierarchical Curriculum
            </h3>
            <p className="relative mt-3 max-w-[40ch] leading-relaxed text-muted-foreground">
              Domain to course to module to lesson. Every level feeds the next, so nothing feels
              random — you always know what unlocks what.
            </p>
            <div className="relative mt-8 space-y-2.5">
              {["Web Engineering", "Blockchain & Web3", "Production Patterns"].map((path) => (
                <div
                  key={path}
                  className="relative flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 transition-colors duration-300 group-hover:border-primary/30"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">{path}</span>
                  <span className="ml-auto text-xs text-muted-foreground">→</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...springDefault, delay: 0.1 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coin/15 text-yellow-200 ring-1 ring-inset ring-coin/25">
              <Coins className="h-6 w-6" />
            </span>
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
              Sync-Coins Rewards
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Passing quizzes mints coins and XP. Build a streak, keep the momentum, watch it compound.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...springDefault, delay: 0.2 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-violet-200 ring-1 ring-inset ring-secondary/25">
              <GitBranch className="h-6 w-6" />
            </span>
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
              Web2 + Web3 Tracks
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Blend frontend, backend, and blockchain skill paths into one roadmap that respects the order.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...springDefault, delay: 0.3 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 md:col-span-2"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-emerald-200 ring-1 ring-inset ring-success/25">
                <Sparkles className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Gamified dashboard
                </h3>
                <p className="mt-1.5 max-w-[52ch] leading-relaxed text-muted-foreground">
                  Watch your skill web grow. Streaks, XP, coins, and milestone unlocks live in one
                  place — so progress always has a face.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                {[
                  { label: "Streak", value: "12d", color: "text-orange-200" },
                  { label: "XP", value: "18.6K", color: "text-violet-200" },
                  { label: "Coins", value: "1.2K", color: "text-yellow-200" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
