# StackSync — Build Tracker

## Phase 1 — Content pipeline (done)
- [x] `gray-matter` dep added for MDX frontmatter parsing
- [x] `User.lastActivityAt` field added (streak calc)
- [x] `src/lib/content-schema.ts` — zod validation for domain/course/module/lesson frontmatter
- [x] `scripts/sync-content.ts` — walks `content/`, upserts DB, idempotent
- [x] `content/web/...` — Web Engineering domain, StackSync Core course, 2 real lessons (type-safety, zustand-state)
- [x] `content/blockchain/...` — Blockchain domain, Web3 Foundations course, 1 real lesson (solidity-tooling)
- [x] `prisma/seed.ts` simplified — only creates demo user + enrollment (curriculum now owned by content sync)
- [x] `npm run content:sync` script added
- [x] `docs/adding-lessons.md` — full authoring guide

## Phase 2 — Wire DB + fix bugs (done)
- [x] Fixed: quiz submit 500 (lesson page was passing slug as lessonId instead of real cuid)
- [x] Fixed: coin/XP double-mint on quiz resubmission
- [x] Server-side quiz grading — client sends answer option IDs, never a raw score
- [x] Real streak calc (`lastActivityAt` day-diff logic in `progress-service.ts`)
- [x] `learn/page.tsx` — real domains/courses/modules/lessons from DB, lock/in-progress/complete status
- [x] `learn/[courseSlug]/[lessonSlug]/page.tsx` — real lesson lookup, MDX rendered via `next-mdx-remote/rsc`
- [x] `quiz-panel.tsx` — real questions/options, per-option correct/incorrect state after submit, retry on fail
- [x] `dashboard/page.tsx` — real streak/XP/coins from `User`
- [x] `skill-web-chart.tsx` — real per-domain completion % (was hardcoded sample data)
- [x] `npx tsc --noEmit` clean, `npm run lint` clean

### Known gap / manual step
No local Postgres reachable in this environment — `prisma migrate dev` for the
`lastActivityAt` column could not be run here. **Before running the app**:
```bash
npm run db:migrate
npm run content:sync
npm run db:seed
```

## Phase 3 — UI revamp (Duolingo-playful, light theme, cyan/violet) — done
- [x] Design tokens in `globals.css` — light background, cyan primary, violet secondary, semantic success/danger/streak/coin colors, very-rounded shape language
- [x] Hand-built UI primitives (`src/components/ui/button.tsx`, `card.tsx`, `badge.tsx`) w/ `class-variance-authority` — chose this over the shadcn CLI since it's more reliable in this sandboxed/offline env; same pattern, same deps
- [x] `framer-motion` installed + micro-interactions: hero fade-in, trail-node stagger + hover bounce, wrong-answer shake, pass/fail result pop-in
- [x] Learning path → trail map w/ circular status nodes (locked/in-progress/complete), alternating offset, in `learning-path.tsx`
- [x] Gamified HUD (`hud.tsx`) — streak flame / coins / XP badges, real data from session, sticky header in `layout.tsx`
- [x] Quiz option states (default/selected/correct/incorrect) — visual pass done in `quiz-panel.tsx`
- [x] Landing page redesign — gradient hero, track pills, feature cards, CTA
- [x] Dashboard redesign — icon stat cards, restyled skill web chart
- [x] Signup page + `/api/auth/register` endpoint (only signin existed before)
- [x] `npx tsc --noEmit` clean, `npm run lint` clean after full pass

### Assets (resolved)
- [x] `public/logo.png` (combined color + outline lockup) and `public/mascot.png` supplied by user — both black-background renders, not transparent PNGs
- [x] Tried flood-fill background removal (`scripts/strip-bg.py`, since removed) — worked for the logo, but broke the mascot because its hoodie is also black and directly connected to the background region (no edge to stop the flood fill). Real cutout needs subject segmentation (e.g. `rembg`), which was a heavier install the user declined.
- [x] Per user direction: stopped further image processing. Using `public/logo.png` cropped to just the colored mark (`public/logo-mark.png`, plain crop, no pixel editing) inside a dark rounded chip (`logo.tsx`) — reads fine on light theme. `public/mascot.png` used as-is (black bg) inside a dark rounded panel in the hero — works in both light/dark contexts since the panel itself is dark.
- [ ] Outline logo variant for an auth-screen skeleton loader — descoped per user ("use as they are... move on"), not built.
- [x] `canvas-confetti` installed, wired into `quiz-panel.tsx` — real confetti burst on quiz pass (previously just a pop-in banner)

## Phase 4 — Freemium + Stripe — done (code-complete, needs real Stripe keys)
- [x] Schema: `Course.isPremium`, `User.stripeCustomerId`, `subscriptionId`, `subscriptionTier` (FREE/PRO), `subscriptionStatus` (NONE/TRIALING/ACTIVE/PAST_DUE/CANCELED)
- [x] `src/lib/stripe.ts` — Stripe client, reads `STRIPE_SECRET_KEY`
- [x] `/api/stripe/checkout` — creates/reuses Stripe customer, starts subscription Checkout Session for `STRIPE_PRICE_ID_PRO`
- [x] `/api/stripe/portal` — billing portal session for existing customers
- [x] `/api/stripe/webhook` — verifies signature with `STRIPE_WEBHOOK_SECRET`, syncs `subscriptionTier`/`subscriptionStatus` on `checkout.session.completed` / `customer.subscription.updated` / `customer.subscription.deleted`
- [x] Lesson page gates premium courses server-side (`Paywall` component) — checked via `course.isPremium` + `user.subscriptionTier`, not client-trusted
- [x] `learn/page.tsx` shows Free/Pro/"Pro unlocked" badges per course
- [x] `content/blockchain/web3-foundations/course.json` flagged `isPremium: true` — Blockchain track is the paid tier, Web stays free (per the original plan)
- [x] `.env.example` documents `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`

### To activate (once you have Stripe account details)
1. Create a recurring "Pro" price in the Stripe dashboard, copy its price ID
2. Fill in `.env`: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`
3. Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook` → copy the printed webhook secret into `STRIPE_WEBHOOK_SECRET`
4. Prod: add a webhook endpoint in the Stripe dashboard pointed at `/api/stripe/webhook`, use its signing secret
5. Run `npm run db:migrate` to apply the new columns
6. Until keys are set, `/api/stripe/checkout` returns a graceful 503 ("Billing is not configured yet") instead of crashing

### Deferred
- [ ] Hearts/lives system (free = limited, paid = unlimited) — not built this pass, scoped for phase 5 if still wanted

## Landing page rebuild (done)
- [x] `navbar.tsx` (client) — logo chip, Learn/Dashboard/Pricing links, streak/coin/XP badges when signed in, mobile hamburger + slide-down menu. `hud.tsx` now just fetches session/user data and renders it.
- [x] `logo.tsx` — reusable logo chip using `public/logo-mark.png`
- [x] `landing-hero.tsx` — hero with mascot panel, CTAs, track pills
- [x] `feature-grid.tsx` — animated feature cards (extracted so `page.tsx` can stay a server component)
- [x] `page.tsx` rebuilt as an async server component: Hero, About (real `domainCount`/`courseCount`/`lessonCount` from Prisma, not fake numbers), Features, Pricing (`#pricing`, Free vs Pro card, Pro hits `UpgradeButton` → Stripe Checkout), CTA, footer
- [x] `upgrade-button.tsx` — shared Stripe checkout trigger, reused by pricing card and `Paywall`
- [x] `npx tsc --noEmit` and `npm run lint` clean after full pass

## Phase 5 — Marketable polish — not started
- [ ] Onboarding flow (pick track/goal after signup)
- [ ] Certificates / shareable badges
- [ ] SEO metadata + OG images per lesson
- [ ] Admin panel for non-dev lesson authoring (phase 2 of content model)

## Course catalog (target)
| Track | Courses |
|---|---|
| Web | HTML/CSS → JS → TypeScript → React → Next.js |
| Backend | Node/APIs → Postgres+Prisma → Auth → Caching/Queues |
| Blockchain | Solidity → EVM internals → Foundry/Hardhat → dApps → Security |
| CS Core | Data Structures → Algorithms → Systems Design |
| DevOps | Git → Docker → CI/CD → Cloud Deploy |

Free tier: Web Foundations intro. Everything else behind Pro (Phase 4).
