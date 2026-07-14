"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Flame, Menu, X, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";

const APP_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#pricing", label: "Pricing" },
];

const MARKETING_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
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
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-lg font-extrabold tracking-tight text-foreground">StackSync</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
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
            <Link
              href="/signin"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-105 sm:inline-block"
            >
              Sign in
            </Link>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-foreground hover:bg-muted sm:hidden"
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
            className="overflow-hidden border-t border-border sm:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
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
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
