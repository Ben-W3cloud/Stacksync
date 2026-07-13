import Link from "next/link";
import { Blocks, Coins, GitBranch, Layers } from "lucide-react";
import { LandingHero } from "@/components/landing-hero";
import { FeatureGrid, type Feature } from "@/components/feature-grid";
import { UpgradeButton } from "@/components/upgrade-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: "Hierarchical Curriculum",
    body: "Domain to course to module to lesson — a real progression, not a video dump.",
  },
  {
    icon: Coins,
    title: "Sync-Coins Rewards",
    body: "Passing quizzes mints coins and XP. Build a streak, keep the momentum.",
  },
  {
    icon: GitBranch,
    title: "Web2 + Web3 Tracks",
    body: "Blend frontend, backend, and blockchain skill paths into one roadmap.",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    tagline: "Get moving on web foundations.",
    features: ["Full Web Engineering track", "Streaks, coins, and XP", "Skill web dashboard"],
  },
  {
    name: "Pro",
    price: "$12",
    tagline: "Unlock every premium track.",
    features: [
      "Everything in Free",
      "Blockchain & Web3 Foundations",
      "All future premium courses",
      "Priority support",
    ],
  },
];

export default async function Home() {
  const [domainCount, courseCount, lessonCount] = await Promise.all([
    prisma.domain.count(),
    prisma.course.count(),
    prisma.lesson.count(),
  ]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <LandingHero />

      <section id="about" className="mt-6">
        <Card className="grid gap-6 p-8 sm:grid-cols-[1.3fr_1fr] sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">
              One roadmap from your first component to your first smart contract.
            </h2>
            <p className="mt-3 text-muted-foreground">
              StackSync structures learning the way real engineering teams structure codebases:
              domains break into courses, courses into modules, modules into lessons — each one
              gated by a real quiz, not a checkbox.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-extrabold text-primary">{domainCount}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Domains</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-secondary">{courseCount}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-success">{lessonCount}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Lessons</div>
            </div>
          </div>
        </Card>
      </section>

      <section id="features" className="mt-10">
        <h2 className="text-2xl font-extrabold text-foreground">Why StackSync</h2>
        <div className="mt-4">
          <FeatureGrid features={FEATURES} />
        </div>
      </section>

      <section id="pricing" className="mt-10 scroll-mt-20">
        <h2 className="text-2xl font-extrabold text-foreground">Pricing</h2>
        <p className="mt-1 text-muted-foreground">Start free. Upgrade when you&rsquo;re ready for Web3.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {PRICING.map((plan) => (
            <Card key={plan.name} className={plan.name === "Pro" ? "p-8 ring-2 ring-secondary" : "p-8"}>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                {plan.name === "Pro" ? <Badge variant="secondary">Most popular</Badge> : null}
              </div>
              <div className="mt-2 text-3xl font-extrabold text-foreground">
                {plan.price}
                <span className="text-sm font-medium text-muted-foreground">/mo</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.name === "Pro" ? (
                <UpgradeButton size="lg" variant="secondary" className="mt-6 w-full" />
              ) : (
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="mt-6 w-full">
                    Create free account
                  </Button>
                </Link>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section id="cta" className="mt-10">
        <Card className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Blocks className="h-8 w-8 text-secondary" />
            <div>
              <h2 className="font-bold text-foreground">Ready to sync your stack?</h2>
              <p className="text-sm text-muted-foreground">
                Create an account and start your first lesson in under a minute.
              </p>
            </div>
          </div>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create free account
            </Button>
          </Link>
        </Card>
      </section>

      <footer className="mt-10 border-t border-border py-8 text-sm text-muted-foreground">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} StackSync</span>
          <div className="flex gap-4">
            <Link href="/learn" className="hover:text-foreground">
              Learn
            </Link>
            <Link href="#pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/signin" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
