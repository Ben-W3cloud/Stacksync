"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Flame, Menu, X, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { springDefault } from "@/lib/motion";

const APP_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn", label: "Start Learning" },
];

const MARKETING_LINKS = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "Journey" },
  { href: "#features", label: "Features" },
];

type UserStats = { streak: number; coinBalance: number; xpTotal: number } | null;

export function Navbar({ user, isAdmin = false }: { user: UserStats; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const loggedIn = Boolean(user);
  const LINKS = loggedIn
    ? isAdmin
      ? [...APP_LINKS, { href: "/admin", label: "Admin" }]
      : APP_LINKS
    : MARKETING_LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logo size={30} className="transition-transform duration-300 group-hover:scale-105" />
          <span className="text-lg font-bold tracking-tight text-foreground">StackSync</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-muted-foreground md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Badge variant="streak">
                <Flame className="h-3.5 w-3.5" />
                {user.streak}
              </Badge>
              <Badge variant="coin">
                <Coins className="h-3.5 w-3.5" />
                {user.coinBalance}
              </Badge>
              <Badge variant="secondary">
                <Zap className="h-3.5 w-3.5" />
                {user.xpTotal} XP
              </Badge>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Start free</Button>
              </Link>
            </div>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springDefault}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="mt-2 flex items-center gap-2 px-3">
                  <Badge variant="streak">
                    <Flame className="h-3.5 w-3.5" />
                    {user.streak}
                  </Badge>
                  <Badge variant="coin">
                    <Coins className="h-3.5 w-3.5" />
                    {user.coinBalance}
                  </Badge>
                  <Badge variant="secondary">
                    <Zap className="h-3.5 w-3.5" />
                    {user.xpTotal} XP
                  </Badge>
                </div>
              ) : (
                <div className="mt-2 grid gap-2">
                  <Link href="/signin" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full">
                      Start free
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
