"use client";

import { type ReactNode, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Quote,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import {
  springDefault,
  springSnappy,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";

type Variant = "signin" | "signup";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
};

export function AuthShell({
  variant,
  eyebrow,
  title,
  subtitle,
  fields,
  submitLabel,
  submittingLabel,
  error,
  success,
  onSubmit,
  footer,
}: {
  variant: Variant;
  eyebrow: string;
  title: string;
  subtitle: string;
  fields: Field[];
  submitLabel: string;
  submittingLabel: string;
  error: string | null;
  success: string | null;
  onSubmit: (values: Record<string, string>) => void;
  footer: ReactNode;
}) {
  return (
    <div className="relative w-full overflow-hidden bg-background text-foreground">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <FormPanel
          variant={variant}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          fields={fields}
          submitLabel={submitLabel}
          submittingLabel={submittingLabel}
          error={error}
          success={success}
          onSubmit={onSubmit}
          footer={footer}
        />
        <VisualPanel variant={variant} />
      </div>
    </div>
  );
}

function FormPanel({
  variant,
  eyebrow,
  title,
  subtitle,
  fields,
  submitLabel,
  submittingLabel,
  error,
  success,
  onSubmit,
  footer,
}: {
  variant: Variant;
  eyebrow: string;
  title: string;
  subtitle: string;
  fields: Field[];
  submitLabel: string;
  submittingLabel: string;
  error: string | null;
  success: string | null;
  onSubmit: (values: Record<string, string>) => void;
  footer: ReactNode;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""])),
  );
  const reduce = useReducedMotion();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden px-6 py-6 sm:px-10 lg:px-14 lg:py-8">
      <Link
        href="/"
        className="pressable inline-flex w-fit items-center gap-2.5 text-foreground"
        aria-label="StackSync home"
      >
        <Logo size={32} />
        <span className="text-base font-bold tracking-tight">StackSync</span>
      </Link>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springDefault}
        className="my-auto w-full pt-10 lg:pt-0"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-[420px]"
        >
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center gap-2 text-primary"
          >
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30"
              aria-hidden
            >
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              {eyebrow}
            </span>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="mt-5 text-[2.5rem] font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-[3rem]"
          >
            {title}
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="mt-3 text-[15px] leading-relaxed text-muted-foreground"
          >
            {subtitle}
          </motion.p>

          <motion.form
            variants={staggerItem}
            onSubmit={handleSubmit}
            className="mt-8 space-y-3.5"
            noValidate
          >
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name] ?? ""}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, [field.name]: v }))
                }
                disabled={submitting}
              />
            ))}

            <div className="flex min-h-[20px] items-center">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={springSnappy}
                    className="inline-flex items-center gap-1.5 text-sm text-danger"
                    role="alert"
                  >
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-danger"
                    />
                    {error}
                  </motion.p>
                ) : null}
                {success ? (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={springSnappy}
                    className="inline-flex items-center gap-1.5 text-sm text-success"
                    role="status"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {success}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "pressable group relative mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-semibold",
                "bg-primary text-primary-foreground",
                "shadow-[0_1px_0_rgba(255,255,255,0.14)_inset,0_14px_30px_-14px_rgba(167,139,250,0.55)]",
                "hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <span>{submitting ? submittingLabel : submitLabel}</span>
              <motion.span
                aria-hidden
                animate={submitting ? { x: 6, opacity: 0.4 } : { x: 0, opacity: 1 }}
                transition={springSnappy}
                className="inline-block"
              >
                →
              </motion.span>
            </button>

          </motion.form>

          <motion.div
            variants={staggerItem}
            className="mt-7 text-sm text-muted-foreground"
          >
            {footer}
          </motion.div>
        </motion.div>
      </motion.div>

      <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground/70">
        By continuing you agree to our{" "}
        <Link href="#" className="underline-offset-2 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline-offset-2 hover:underline">
          Privacy
        </Link>
        .
      </p>
    </section>
  );
}

function FormField({
  field,
  value,
  onChange,
  disabled,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();
  const Icon = field.icon;
  const filled = value.length > 0;
  const isPassword = field.type === "password";
  const inputType = isPassword && show ? "text" : field.type;

  return (
    <div className="w-full">
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-md transition-colors",
          focused
            ? "border-primary/70 shadow-[0_0_0_4px_rgba(167,139,250,0.12)]"
            : "border-border/80 hover:border-border",
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-12 transition-all duration-200 ease-out",
            focused || filled
              ? "top-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"
              : "top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground",
          )}
        >
          {field.label}
        </label>

        <div className="flex h-14 items-center px-4">
          <Icon
            aria-hidden
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              focused ? "text-primary" : "text-muted-foreground/80",
            )}
          />
          <input
            id={id}
            name={field.name}
            type={inputType}
            value={value}
            placeholder={focused ? field.placeholder : ""}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            required={field.required}
            minLength={field.minLength}
            autoComplete={field.autoComplete}
            className="ml-3 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/40"
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              disabled={disabled}
              aria-label={show ? "Hide password" : "Show password"}
              className="pressable ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <AnimatePresence mode="wait" initial={false}>
                {show ? (
                  <motion.span
                    key="eyeoff"
                    initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.7 }}
                    transition={springSnappy}
                    className="inline-flex"
                  >
                    <EyeOff className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="eye"
                    initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.7 }}
                    transition={springSnappy}
                    className="inline-flex"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ) : null}
        </div>

        <motion.span
          aria-hidden
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={springDefault}
          style={{ transformOrigin: "left" }}
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </div>
    </div>
  );
}

function VisualPanel({ variant }: { variant: Variant }) {
  return (
    <aside
      aria-hidden
      className="relative hidden min-h-[100dvh] overflow-hidden border-l border-border/60 bg-card lg:block"
    >
      <PanelBackground />
      <div className="relative z-10 flex h-full flex-col p-10">
        <PanelHeader variant={variant} />
        <div className="my-8 flex-1">
          <ProductPreview variant={variant} />
        </div>
        <PanelFooter />
      </div>
    </aside>
  );
}

function PanelBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 60% at 75% 20%, rgba(167,139,250,0.30) 0%, transparent 60%), radial-gradient(55% 55% at 20% 85%, rgba(139,92,246,0.22) 0%, transparent 65%)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -top-24 -right-20 h-[26rem] w-[26rem] rounded-full bg-primary/25 blur-3xl"
        animate={{ y: [0, 16, 0], x: [0, -8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-24 -left-16 h-[22rem] w-[22rem] rounded-full bg-secondary/25 blur-3xl"
        animate={{ y: [0, -14, 0], x: [0, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function PanelHeader({ variant }: { variant: Variant }) {
  return (
    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_18px_4px_rgba(167,139,250,0.55)]"
        />
        {variant === "signin" ? "Welcome back" : "Begin journey"}
      </span>
      <span className="font-mono text-[10px] text-muted-foreground/60">
        v2.6
      </span>
    </div>
  );
}

function ProductPreview({ variant }: { variant: Variant }) {
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <div className="space-y-2">
        <h2 className="text-[28px] font-extrabold leading-[1.05] tracking-tight text-foreground">
          {variant === "signin"
            ? "Your stack is waiting."
            : "Learn Web2 + Web3 in one place."}
        </h2>
        <p className="max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
          {variant === "signin"
            ? "Pick up where you left off. Streaks, XP, and on-chain credentials sync across every device."
            : "Bite-sized lessons, on-chain credentials, and a learning path that adapts as you grow."}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <SkillRadar className="col-span-3" />
        <StreakCard className="col-span-2" />
      </div>

      <Testimonial />
    </div>
  );
}

function SkillRadar({ className }: { className?: string }) {
  const points = 6;
  const values = [0.78, 0.62, 0.84, 0.48, 0.7, 0.58];
  const labels = ["Web", "API", "Data", "Crypto", "UX", "DevOps"];
  const cx = 100;
  const cy = 100;
  const r = 78;

  const vertex = (i: number, scale: number) => {
    const angle = (Math.PI * 2 * i) / points - Math.PI / 2;
    return [cx + Math.cos(angle) * r * scale, cy + Math.sin(angle) * r * scale] as const;
  };

  const rings = [0.33, 0.66, 1].map((scale) =>
    Array.from({ length: points }, (_, i) => vertex(i, scale).join(",")).join(" "),
  );

  const polygon = values
    .map((v, i) => vertex(i, v).join(","))
    .join(" ");

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-background/40 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Skill web
        </span>
        <span className="font-mono text-[10px] text-primary">+12 XP today</span>
      </div>
      <svg
        viewBox="0 0 200 200"
        className="mt-2 h-32 w-full"
        aria-hidden
      >
        {rings.map((d, i) => (
          <polygon
            key={i}
            points={d}
            fill="none"
            stroke="rgba(167,139,250,0.18)"
            strokeWidth="1"
          />
        ))}
        {labels.map((label, i) => {
          const [x, y] = vertex(i, 1.18);
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--muted-foreground)]"
              style={{ fontSize: 8, fontWeight: 600, letterSpacing: 0.4 }}
            >
              {label.toUpperCase()}
            </text>
          );
        })}
        <motion.polygon
          points={polygon}
          fill="rgba(167,139,250,0.30)"
          stroke="rgba(167,139,250,0.95)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springDefault}
          style={{ transformOrigin: "100px 100px" }}
        />
        {values.map((v, i) => {
          const [x, y] = vertex(i, v);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="rgba(167,139,250,1)"
            />
          );
        })}
      </svg>
    </div>
  );
}

function StreakCard({ className }: { className?: string }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const active = [true, true, true, true, false, false, false];
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-border/70 bg-background/40 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Streak
        </span>
        <FlameMini />
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            28
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground">
            days
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          {days.map((d, i) => (
            <span
              key={i}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-bold",
                active[i]
                  ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                  : "bg-muted text-muted-foreground/60 ring-1 ring-border",
              )}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlameMini() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-streak/15 text-streak ring-1 ring-streak/30">
      <Zap className="h-2.5 w-2.5" />
    </span>
  );
}

function Testimonial() {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/40 p-4 backdrop-blur-sm">
      <Quote className="h-3.5 w-3.5 text-primary/70" />
      <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
        “Finished the Solidity track in 6 evenings. The on-chain cert actually
        shows up in my wallet — recruiters noticed.”
      </p>
      <div className="mt-3 flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary ring-1 ring-primary/30"
        >
          MO
        </span>
        <div className="leading-tight">
          <p className="text-[12px] font-semibold text-foreground">
            Mira Okonkwo
          </p>
          <p className="text-[10px] text-muted-foreground">
            Frontend · Tessellate Labs
          </p>
        </div>
      </div>
    </div>
  );
}

function PanelFooter() {
  const slides = [
    { label: "Welcome", active: false },
    { label: "Build", active: true },
    { label: "Earn", active: false },
    { label: "Sync", active: false },
  ];
  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-5 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">SOC2 in progress</span>
        </span>
        <span className="hidden h-3 w-px bg-border sm:inline-block" />
        <span className="hidden font-mono text-[10px] text-muted-foreground/70 sm:inline">
          stacksync.app
        </span>
      </div>
      <div className="flex items-center gap-1.5" aria-hidden>
        {slides.map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className={cn(
              "h-1.5 rounded-full",
              s.active ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40",
            )}
            initial={false}
            animate={{ width: s.active ? 24 : 6 }}
            transition={springDefault}
          />
        ))}
      </div>
    </div>
  );
}

