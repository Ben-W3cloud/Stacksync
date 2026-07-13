import { type HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      primary: "bg-primary/10 text-primary",
      secondary: "bg-secondary/10 text-secondary",
      success: "bg-success/10 text-success",
      danger: "bg-danger/10 text-danger",
      streak: "bg-streak/10 text-streak",
      coin: "bg-coin/15 text-yellow-700",
      muted: "bg-muted text-muted-foreground",
    },
  },
  defaultVariants: { variant: "muted" },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = "Badge";
