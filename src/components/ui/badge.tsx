import { type HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-violet-200 ring-primary/30",
        secondary: "bg-secondary/10 text-violet-200 ring-secondary/30",
        success: "bg-success/10 text-emerald-200 ring-success/30",
        danger: "bg-danger/10 text-rose-200 ring-danger/30",
        streak: "bg-streak/10 text-orange-200 ring-streak/30",
        coin: "bg-coin/10 text-yellow-200 ring-coin/30",
        muted: "bg-muted text-muted-foreground ring-border",
      },
    },
    defaultVariants: { variant: "muted" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = "Badge";
