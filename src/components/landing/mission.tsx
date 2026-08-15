"use client";

import { motion } from "framer-motion";
import { Compass, Layers, Target } from "lucide-react";
import { fadeUpInView } from "@/lib/motion";

const PILLARS = [
  {
    icon: Target,
    title: "Structured, not scattered",
    body: "Domain → course → module → lesson. A real progression, not a video dump.",
  },
  {
    icon: Layers,
    title: "Two worlds, one path",
    body: "Solid web engineering first, then blockchain. Each skill layers on the last.",
  },
  {
    icon: Compass,
    title: "Built to ship",
    body: "Quizzes, streaks, and coins that push you toward production code and on-chain apps.",
  },
];

const SKILLS = [
  { label: "React", pct: 88 },
  { label: "TypeScript", pct: 74 },
  { label: "Node.js", pct: 66 },
  { label: "Solidity", pct: 41 },
];

export function LandingMission() {
  return (
    <section id="about" className="bg-panel scroll-mt-24 border-y border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeUpInView()}>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">About</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
              A learning platform that treats the full stack as one journey.
            </h2>
            <p className="mt-5 max-w-[55ch] text-lg leading-relaxed text-muted-foreground">
              StackSync bridges modern web engineering and blockchain development. We believe the
              fastest way to master production code and on-chain applications is a structured,
              hands-on path you can feel yourself moving through.
            </p>
            <div className="mt-9 space-y-5">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/25">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{pillar.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8">
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                Skill web
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {SKILLS.map((skill) => (
                  <div key={skill.label} className="rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{skill.label}</p>
                      <p className="font-mono text-xs font-semibold text-primary">{skill.pct}%</p>
                    </div>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${skill.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-sm font-medium text-foreground">Blockchain track</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Next milestone · <span className="text-primary">Smart Contract Basics</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
