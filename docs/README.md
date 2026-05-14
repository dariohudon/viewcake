# Viewcake

Real-time presentation amplification. A presenter runs a live deck session; audience members follow along, save slides, add private notes, ask questions, and share individual slides via a public link.

---

## Architecture

One Next.js App Router application serving two distinct experiences:

**Presenter side** — authenticated routes under `/dashboard`, `/presentations`, and `/sessions`.  
**Audience side** — unauthenticated routes under `/join`, `/live/[code]`, and `/s/[shareSlug]`.

There is no separate backend service. Server Actions and Route Handlers handle mutations. Prisma talks to PostgreSQL.

---

## Route map

### Presenter (requires auth)

| Route | Purpose |
|---|---|
| `/login` | Sign-in page |
| `/dashboard` | Overview: presentations, session stats |
| `/presentations` | List all presentations |
| `/presentations/new` | Create a presentation, upload deck |
| `/presentations/[id]` | View/edit a presentation, see past sessions |
| `/sessions/[id]/presenter` | Live presenter console: slide control, join code, participant count |

### Audience (public)

| Route | Purpose |
|---|---|
| `/join` | Enter a join code |
| `/live/[code]` | Follow the live session, save slides, add notes, ask questions |
| `/s/[shareSlug]` | View a single shared slide via public link |

---

## Data models

| Model | Description |
|---|---|
| `User` | Presenter account |
| `Presentation` | A deck with metadata and slide count |
| `Slide` | Individual slide with image path, order, presenter notes |
| `LiveSession` | A live instance of a presentation; holds join code and current slide index |
| `AudienceParticipant` | Anonymous or named person who joined a session |
| `SlideAnnotation` | A note left by an audience member on a slide |
| `SlideSave` | An audience member bookmarking a slide |
| `SlideShare` | A public share link for a single slide |
| `EngagementEvent` | Flexible event log (slide views, questions, saves) for analytics |

---

## MVP scope

This is the foundation pass. It includes:

- Clean route structure with placeholder UI
- Full Prisma schema — all core models defined
- File upload folder structure (`uploads/decks/`, `uploads/slides/`)
- `.env.example` with required variables

---

## Intentionally not built yet

- **Authentication** — login form is a UI placeholder; no sessions or JWT
- **PDF processing** — deck uploads UI exists but no parsing or slide extraction
- **Real-time sync** — `/live/[code]` is static; no WebSocket or SSE yet
- **Server Actions / API routes** — no mutations wired up
- **Database queries** — pages render static placeholder content
- **Payments / billing**
- **AI features**
- **Email / notifications**

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in values
cp .env.example .env

# 3. Create the database and run migrations
npx prisma migrate dev --name init

# 4. Start dev server
npm run dev
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Secret for future auth (generate: `openssl rand -base64 32`) |
| `APP_URL` | Public base URL of the app |
