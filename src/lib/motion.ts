import type { Transition, Variants } from "framer-motion";

/**
 * Motion presets for StackSync.
 *
 * Springs are the default easing — critically damped for UI transitions,
 * snappier for micro-interactions. Bounce is reserved for momentum-driven
 * moments (dialogs, mascot entrances), never for routine reveals.
 */

/** Default spring — critically damped, no bounce. */
export const springDefault: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
};

/** Snappier spring for toggles, small reveals, and inline feedback. */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
};

/** Parent container that staggers its children into view. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/** Child item used with `staggerContainer`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: springDefault,
  },
};

/** Hover lift for cards and pressable panels. */
export const cardHover =
  "transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.7)]";

/**
 * Fade-up-on-scroll props for a `motion` element.
 * Spread onto the element: `<motion.div {...fadeUpInView()} />`.
 */
export function fadeUpInView(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { ...springDefault, delay },
  };
}