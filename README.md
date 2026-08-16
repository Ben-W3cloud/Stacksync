# StackSync

A gamified learning platform that bridges modern web engineering and blockchain development. Structured courses, quizzes, streaks, and Sync-Coins push learners from production web code to on-chain applications.

## Tech Stack

- **Framework** — Next.js 16 (App Router, RSC + client islands)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4 with a custom Apple-style dark design system
- **Database** — PostgreSQL with Prisma ORM
- **Auth** — NextAuth.js (credentials)
- **Data fetching** — TanStack Query (client mutations)
- **Motion** — Framer Motion (spring physics, scroll-driven effects)
- **Content** — MDX lessons synced into the database

## Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a `DATABASE_URL` pointing at any Postgres instance)
- npm

## Getting Started

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables. Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   | Variable          | Description                                  |
   | ----------------- | -------------------------------------------- |
   | `DATABASE_URL`    | PostgreSQL connection string                 |
   | `NEXTAUTH_URL`    | Public base URL (e.g. `http://localhost:3000`) |
   | `NEXTAUTH_SECRET` | Long random secret for session signing       |
   | `ADMIN_EMAIL`     | Email granted admin access to `/admin`       |

3. Create the database schema and seed initial data:

   ```bash
   npm run db:generate
   npm run db:seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the development server                 |
| `npm run build`      | Create a production build                    |
| `npm run start`      | Run the production build                     |
| `npm run lint`       | Lint the codebase                            |
| `npm run db:generate`| Regenerate the Prisma client                 |
| `npm run db:migrate` | Create and apply database migrations         |
| `npm run db:seed`    | Seed domains, courses, and lessons           |
| `npm run content:sync` | Sync MDX content from `content/` into the DB |

## Project Structure

```
src/
  app/                    # App Router pages + API routes
    api/                  # Route handlers (auth, lessons, onboarding, hubby)
    learn/                # Learning path + lesson pages
    dashboard/            # Learner profile dashboard
    admin/                # Admin metrics dashboard
    certificates/         # Certificate pages
  components/             # UI components (shared + feature)
    landing/              # Marketing page sections
    ui/                   # Design-system primitives (button, card, badge)
  lib/                    # Auth, prisma, motion presets, content schema
  store/                  # Zustand client state
prisma/
  schema.prisma           # Database schema
  seed.ts                 # Seed script
  sql/init.sql            # Manual SQL bootstrap
content/                  # MDX lesson source (web + blockchain domains)
```

## Design System

StackSync ships a dark-only, Apple-inspired design system:

- **Tokens** — near-black tinted background (`#0d0a14`), single violet accent, glass cards, defined in `src/app/globals.css`
- **Typography** — Apple system font stack (SF Pro on Apple devices, Segoe fallback elsewhere)
- **Motion** — critically damped springs by default, bounce reserved for momentum interactions; presets in `src/lib/motion.ts`
- **System docs** — `DESIGN.md` at the repo root tracks the design decisions

## Adding Content

Courses follow a `Domain → Course → Module → Lesson` hierarchy. Add MDX files under `content/`, mirror the existing `domain.json` / `course.json` / `module.json` structure, then run:

```bash
npm run content:sync
```

Lessons can include a quiz (with configurable passing score) and external resources (YouTube, GitHub, docs).

## Deployment

Deploy on [Vercel](https://vercel.com) with a Postgres database (e.g. Neon, Supabase, Railway):

1. Push the schema to your production database with `npm run db:migrate`.
2. Run `npm run db:seed` once to load initial content.
3. Set the same environment variables from `.env.example` in your Vercel project.
4. Add a scheduled `npm run content:sync` job (or run it before deploy) to keep MDX content in sync.
