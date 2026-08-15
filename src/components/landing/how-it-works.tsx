"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Blocks, Code2, Rocket, Trophy } from "lucide-react";
import { fadeUpInView } from "@/lib/motion";

const STEPS = [
  {
    number: "01",
    title: "Master the web",
    body: "Build a strong base in modern web engineering — structured courses, real quizzes, production patterns.",
    icon: Code2,
  },
  {
    number: "02",
    title: "Level up to Web3",
    body: "Transition into blockchain with guided modules on Solidity, smart contracts, and dApps.",
    icon: Blocks,
  },
  {
    number: "03",
    title: "Ship real projects",
    body: "Turn lessons into portfolio work. Every skill you learn is aimed at code you can actually ship.",
    icon: Rocket,
  },
  {
    number: "04",
    title: "Build & earn",
    body: "Pass quizzes, keep streaks, and mint Sync-Coins and XP as you climb the path.",
    icon: Trophy,
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.45"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div className="text-center" {...fadeUpInView()}>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">The journey</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-[55ch] text-lg text-muted-foreground">
            One vertical path from your first lesson to your first on-chain app. The line fills as
            you scroll through it.
          </p>
        </motion.div>

        <div ref={ref} className="relative mt-16">
          <motion.div
            style={{ scaleY }}
            className="absolute bottom-4 left-[27px] top-4 w-px origin-top bg-gradient-to-b from-primary via-primary/40 to-transparent"
          />

          <div className="space-y-12">
            {STEPS.map((step) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                className="relative flex gap-6 sm:gap-10"
              >
                <div className="relative z-10 flex w-14 shrink-0 flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/40 bg-background text-primary"
                  >
                    <step.icon className="h-5 w-5" />
                  </motion.div>
                </div>

                <div
                  className={`flex-1 rounded-3xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/40 sm:p-8 ${
                    step.number === "02" || step.number === "04" ? "sm:ml-16" : ""
                  }`}
                >
                  <p className="font-mono text-sm font-semibold uppercase tracking-widest text-primary/80">
                    Step {step.number}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[52ch] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
