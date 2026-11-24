# Timeless

> Share the words that move you. Post a quote and inspire the next generation.

Timeless is a quote collection built around four historical figures: **Miyamoto Musashi**, **Marcus Aurelius**, **Napoleon Bonaparte** and **Seneca**. You pick an author from a tilting card gallery and get a draggable, animated stack of their quotes over a looping video background. You can also shuffle quotes from every author, read a short bio of each one, or submit a quote of your own for review.

## Features

- **Author gallery**: the home page shows 3D tilt cards (via `vanilla-tilt`) that link to each author's quotes and bio.
- **Quote stacks**: `/[author]` shows that author's quotes as a "dropping cards" stack you can drag, animated with GSAP (`Draggable` and `CustomEase`). The stack starts at a random quote.
- **Random quotes**: `/random` shuffles approved quotes from all authors into one stack.
- **Author bios**: each author has a bio page under `/bio/musashi/<author>`.
- **Quote submissions**: `/submit-quote` sends new quotes to the API. They're saved with `approved: false` until someone reviews them.
- **Page transitions**: built on React's `<ViewTransition>`.

## Tech stack

| Layer      | Tool                                           |
| ---------- | ---------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19, TypeScript  |
| Styling    | Tailwind CSS v4 plus per-page CSS files        |
| Animation  | GSAP 3, vanilla-tilt                           |
| Database   | PostgreSQL through Prisma ORM 6                |
| Hosting    | Vercel                                         |

## Getting started

### Prerequisites

- Node.js 20 or newer
- A PostgreSQL database (for example Prisma Postgres, Neon or Supabase)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root. It's already gitignored.

```env
# Pooled connection string, used by the app at runtime
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"

# Direct (non-pooled) connection string, used by Prisma Migrate
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
```

### 3. Set up the database

```bash
npx prisma migrate deploy   # apply migrations
npx prisma db seed          # load the starter quotes
```

The seed script (`prisma/seed.ts`) **deletes every existing quote** and then inserts the roughly 200 quotes from `prisma/quotes.ts`, all marked as approved. Don't run it against a database that holds submissions you want to keep.

### 4. Run the dev server

```bash
npm run frontend
```

Then open <http://localhost:3000>.

> The dev script is named `frontend`, not `dev`.

## Scripts

| Command            | What it does                                     |
| ------------------ | ------------------------------------------------ |
| `npm run frontend` | Start the Next.js dev server                     |
| `npm run build`    | Build for production                             |
| `npm run start`    | Serve the production build                       |
| `npm run lint`     | Run ESLint                                       |
| `npx prisma db seed` | Reset the quotes table and load the seed data |
| `npx prisma studio`  | Browse and edit the database (for example, to approve submissions) |

## Project structure

```
app/
├── page.tsx                  # Home: author gallery
├── [author]/                 # Quote stack for one author (e.g. /seneca)
│   ├── page.tsx
│   └── DroppingStack.tsx     # GSAP draggable card stack
├── random/                   # Shuffled stack across all authors
├── submit-quote/             # Quote submission form
├── bio/musashi/<author>/     # Author bio pages
├── api/quotes/               # REST endpoints (see below)
├── components/               # Shared components (profile pop-up)
├── Nav.tsx, Tilt.tsx         # Site nav and tilt wrapper
└── layout.tsx                # Root layout, fonts, metadata
lib/
└── prisma.ts                 # Shared Prisma client
prisma/
├── schema.prisma             # Quote model
├── migrations/
├── quotes.ts                 # Seed data
└── seed.ts
public/media-assets/          # Author cards, backgrounds, video
```

### Author URL slugs

Author pages match the slug against the `author` field, ignoring case and treating dashes as spaces. The home page links to:

| Author            | Slug                  |
| ----------------- | --------------------- |
| Miyamoto Musashi  | `/miyamoto-musashi`   |
| Marcus Aurelius   | `/marcus-aurelius`    |
| Napoleon Bonaparte| `/napoleon-bonaparte` |
| Seneca            | `/seneca`             |

## Data model

```prisma
model Quote {
  id        Int      @id @default(autoincrement())
  text      String
  author    String
  approved  Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([author])
}
```

## API

| Method | Route                           | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| `POST` | `/api/quotes`                   | Submit a quote (saved as unapproved) |
| `GET`  | `/api/quotes/random`            | One random quote from any author    |
| `GET`  | `/api/quotes/musashi`           | One random Musashi quote            |
| `GET`  | `/api/quotes/marcus-aurelius`   | One random Marcus Aurelius quote    |
| `GET`  | `/api/quotes/napoleon`          | One random Napoleon quote           |
| `GET`  | `/api/quotes/seneca`            | One random Seneca quote             |

**Submitting a quote:**

```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{"text": "The obstacle is the way.", "author": "Marcus Aurelius"}'
```

Validation rules:

- `text` must be 5 to 300 characters.
- `author` must be 1 to 100 characters.

Invalid input returns `400` with `{ "error": "..." }`. A successful request returns `201` with the created quote.

## Moderating submissions

New submissions are stored with `approved = false`. To publish one, set `approved` to `true`, for example in Prisma Studio:

```bash
npx prisma studio
```

## Deployment

The project is set up for [Vercel](https://vercel.com). Add `DATABASE_URL` and `DIRECT_URL` to the project's environment variables, then deploy. Run `npx prisma migrate deploy` against the production database whenever the schema changes.

## A note on this Next.js version

This project runs **Next.js 16**, which changes some APIs and conventions from earlier versions. Before you change framework-level code, read the bundled guides in `node_modules/next/dist/docs/` (see `AGENTS.md`).
