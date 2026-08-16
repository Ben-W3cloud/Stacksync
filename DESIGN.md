# StackSync Design System

StackSync ships a dark-only, Apple-inspired design system. This document tracks the design decisions so they stay consistent across the codebase.

## Foundations

- **Mode** — Dark only. `color-scheme: dark` is set on `:root`; there is no light variant.
- **Background** — Near-black tinted violet (`#0d0a14`) instead of pure black, so glass cards and glows read as layered rather than flat.
- **Accent** — Single violet accent (`#a78bfa` primary, `#8b5cf6` secondary). Violet is used sparingly for interactive and emphasis elements; it is never used as a gradient fill.
- **Surfaces** — Glass cards (`bg-card` + `border-border` + inset highlight) with a subtle `backdrop-blur` on chrome (navbar, auth panels).
- **Typography** — Apple system font stack (SF Pro on Apple devices, Segoe UI fallback elsewhere). Mono (`SF Mono` / `ui-monospace`) reserved for code, labels, and data readouts.
- **Radius** — Generous, consistent radii: `rounded-2xl` for controls, `rounded-3xl` for cards, `rounded-[2rem]` for hero/feature panels.
- **Motion** — Critically damped springs by default (`springDefault`); bounce reserved for momentum interactions (dialogs, mascot entrances). Presets live in `src/lib/motion.ts`.

## Tokens

Defined in `src/app/globals.css` and exposed to Tailwind via `@theme inline`:

| Token              | Value     | Usage                          |
| ------------------ | --------- | ------------------------------ |
| `--background`     | `#0d0a14` | Page background                |
| `--foreground`     | `#f4f1fb` | Primary text                   |
| `--card`           | `#161221` | Card / panel surface           |
| `--muted`          | `#1e182b` | Muted surface (chips, wells)   |
| `--muted-foreground`| `#a89fc2`| Secondary text                 |
| `--border`         | `#2a2336` | Hairline borders               |
| `--primary`        | `#a78bfa` | Accent / interactive           |
| `--secondary`      | `#8b5cf6` | Secondary accent               |
| `--success`        | `#6ee7b7` | Correct / earned               |
| `--danger`         | `#fda4af` | Errors / incorrect             |
| `--streak`         | `#fdba74` | Streak indicator               |
| `--coin`           | `#fde68a` | Sync-Coins indicator           |

## Components

- **Button** — Pill (`rounded-full`), `pressable` scale feedback, inset top highlight. Variants: primary, secondary, outline, ghost.
- **Card** — `rounded-3xl`, hairline border, inset highlight. Optional `cardHover` lift.
- **Badge** — Pill with tinted background + inset ring. Variants map to semantic tokens (success, danger, streak, coin, muted).
- **Dialog** — Bottom-sheet on mobile, centered on desktop. Spring entrance, backdrop blur, Escape-to-close.

## Interaction Notes

- Press feedback is a subtle `scale(0.97)` via the `.pressable` utility — never a color flash.
- Focus is always visible: a violet ring via `:focus-visible`.
- `prefers-reduced-motion` disables scroll-driven and entrance animations; content is never gated behind motion.
- Lesson completion and coin/XP rewards are shown immediately and prominently (confetti + Hubby modal).

## Content & Gamification

- Curriculum hierarchy: `Domain → Course → Module → Lesson`.
- Passing a quiz mints **+25 Sync-Coins** and **+50 XP** and advances the streak.
- Lessons are authored as MDX in `content/` and synced into the database via `npm run content:sync`.