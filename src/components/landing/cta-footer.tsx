import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCtaFooter() {
  return (
    <>
      <section className="bg-panel border-t border-border/60 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card px-6 py-14 text-center sm:px-14 sm:py-16">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
            <h2 className="relative text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Ready to sync your stack?
            </h2>
            <p className="relative mx-auto mt-4 max-w-[48ch] text-lg text-muted-foreground">
              Create an account and start your first lesson in under a minute. Free forever to begin.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Create free account
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse the curriculum
                </Button>
              </Link>
            </div>
            <p className="relative mt-5 text-xs text-muted-foreground">
              No card required · Sync-Coins and XP from your first quiz
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 sm:flex-row">
          <div className="flex gap-6">
            <Link href="#about" className="transition-colors duration-200 hover:text-foreground">
              About
            </Link>
            <Link href="#how-it-works" className="transition-colors duration-200 hover:text-foreground">
              Journey
            </Link>
            <Link href="/signin" className="transition-colors duration-200 hover:text-foreground">
              Sign in
            </Link>
          </div>
          <span>&copy; {new Date().getFullYear()} StackSync. Learn, build, earn.</span>
        </div>
      </footer>
    </>
  );
}
