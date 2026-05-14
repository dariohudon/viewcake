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
| `/sessions/[id]/presenter` | Live presenter console — shows real join code |

### Audience (public)

| Route | Purpose |
|---|---|
| `/join` | Enter a join code |
| `/live/[code]` | Follow the live session — resolves real `LiveSession` by code |
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

**Implemented.** When a deck is uploaded, each PDF page is rendered to a PNG image using Poppler (`pdftoppm`). One `Slide` record is created per page with the image path stored in `Slide.imagePath`.

- **Requires:** `poppler-utils` — `sudo apt install poppler-utils -y`
- **Renderer:** `pdftoppm -r 150 -png` (150 DPI PNG)
- **PDF storage:** `uploads/decks/<uuid>-<filename>.pdf`
- **Slide image storage:** `uploads/slides/<presentationId>/slide-N.png`
- **Served via:** `GET /api/uploads/slides/[presentationId]/[filename]`

If rendering fails (e.g. `poppler-utils` missing or corrupt PDF), the upload falls back to creating one placeholder `Slide` record and the presentation status stays `DRAFT`. A successful render sets status to `READY`.

Full PowerPoint support and AI-assisted extraction are still future work.

---

## Intentionally not built yet

- **Authentication** — `userId` is nullable on `Presentation`; login form is placeholder only
- **PowerPoint / PPTX support** — PDF only for now
- **Real-time sync** — `/live/[code]` shows session info but no WebSocket or SSE
- **Audience participant registration** — `/live/[code]` does not yet create `AudienceParticipant` records
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
