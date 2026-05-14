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
| `/presentations` | List all presentations — **live, reads DB** |
| `/presentations/new` | Create a presentation, upload deck — **live, writes DB + disk** |
| `/presentations/[id]` | View presentation, slides, file metadata — **live, reads DB** |
| `/sessions/[id]/presenter` | Live presenter console — placeholder |

### Audience (public)

| Route | Purpose |
|---|---|
| `/join` | Enter a join code |
| `/live/[code]` | Follow the live session — placeholder |
| `/s/[shareSlug]` | View a single shared slide — placeholder |

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

## Upload behaviour

Uploaded PDF files are saved to `uploads/decks/` at the project root. Files are named `<uuid>-<original-filename>.pdf` to avoid collisions. The relative path and original filename are stored on the `Presentation` record.

The `uploads/` directory is `.gitignore`d and is not committed.

### PDF-to-slide extraction

**Not yet implemented.** When a deck is uploaded, one placeholder `Slide` record (order: 1, no image) is created. Full page count detection and slide image rendering are deferred to a future pass. The placeholder ensures the data model is intact and the detail page has something to render.

When extraction is implemented, the `Slide.imagePath` and `Slide.thumbnailPath` fields will hold relative paths under `uploads/slides/`, and `Presentation.slideCount` will reflect the true page count.

---

## Intentionally not built yet

- **Authentication** — `userId` is nullable on `Presentation`; login form is placeholder only
- **PDF-to-image extraction** — see section above
- **File serving** — uploaded PDFs are stored on disk but not served over HTTP yet
- **Real-time sync** — `/live/[code]` is static; no WebSocket or SSE
- **Live sessions** — session start flow is a placeholder
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

# 3. Grant schema permissions (PostgreSQL 15+)
sudo -u postgres psql -d viewcake -c "GRANT ALL ON SCHEMA public TO viewcake_user;"

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Start dev server
npm run dev
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Secret for future auth (generate: `openssl rand -base64 32`) |
| `APP_URL` | Public base URL of the app |
