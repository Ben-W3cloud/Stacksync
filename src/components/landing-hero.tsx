"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Coins, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { springDefault, staggerContainer, staggerItem } from "@/lib/motion";

const STATS = [
  { to: 2400, decimals: 0, prefix: "", suffix: "+", label: "Lessons across web2 + web3" },
  { to: 47.3, decimals: 1, prefix: "", suffix: "K", label: "Learners building streaks" },
  { to: 18.6, decimals: 1, prefix: "", suffix: "M", label: "XP minted on quizzes" },
  { to: 9.2, decimals: 1, prefix: "", suffix: "/ 10", label: "Learner satisfaction" },
];

function CountUp({ to, decimals, prefix, suffix }: (typeof STATS)[number]) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const format = (value: number) =>
      `${prefix}${value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (reduced) {
      node.textContent = format(to);
      return;
    }

    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        node.textContent = format(value);
      },
    });
    return () => controls.stop();
  }, [to, decimals, prefix, suffix, reduced]);

  return <p ref={ref} className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl" />;
}

const LESSON_ROWS = [
  { title: "React Foundations", tag: "Frontend", done: true },
  { title: "TypeScript Strict Mode", tag: "Types", done: false },
  { title: "Solidity Basics", tag: "Web3", done: false },
];

export function LandingHero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-24 sm:pt-20">
      <div className="bg-grid pointer-events-none absolute inset-0" />

      <motion.div
        variants={staggerContainer}
        initial={reduced ? false : "hidden"}
        animate="show"
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div variants={staggerItem}>
          <Badge variant="primary" className="px-4 py-1.5 text-sm">
            <Zap className="h-3.5 w-3.5" />
            Gamified web2 → web3 learning
          </Badge>
        </motion.div>

        <motion.h1
          variants={staggerItem}
          className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Master production code.
          <br />
          <span className="text-accent">Then ship on-chain.</span>
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          StackSync turns modern web engineering and blockchain development into one structured,
          streak-fueled path. Every lesson, quiz, and coin pulls you toward shipping real skills.
        </motion.p>

        <motion.div variants={staggerItem} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Start learning free
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <Link href="#how-it-works" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              See the journey
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springDefault, delay: 0.35 }}
        className="relative mx-auto mt-16 max-w-3xl px-6"
      >
        <div className="rounded-[2rem] border border-border bg-card p-2 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-1.5 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">stacksync.app/dashboard</span>
          </div>

          <div className="rounded-[1.4rem] bg-background p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-2xl font-semibold tracking-tight text-foreground">Keep the streak alive</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="coin">
                  <Coins className="h-3.5 w-3.5" />
                  1,284
                </Badge>
                <Badge variant="streak">
                  <Flame className="h-3.5 w-3.5" />
                  12
                </Badge>
              </div>
            </div>

            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ ...springDefault, delay: 0.6 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">68% of today&apos;s goal · +120 XP on the line</p>

            <div className="mt-5 space-y-2.5">
              {LESSON_ROWS.map((row) => (
                <div
                  key={row.title}
                  className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        row.done ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {row.done ? <Check className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{row.title}</p>
                      <p className="text-xs text-muted-foreground">{row.tag}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary">+40 XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ ...springDefault, delay: 0.2 }}
        className="relative mx-auto mt-20 max-w-6xl px-6"
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <CountUp {...stat} />
              <p className="mx-auto mt-2.5 max-w-[20ch] text-sm leading-snug text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="relative mx-auto mt-8 h-px max-w-6xl bg-border/40" />
    </section>
  );
}
