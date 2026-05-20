# Viewcake — Operations Guide

Real-time presentation amplification. Presenter uploads a PDF deck, starts a live session, shares a join code. Audience joins from any device, follows along, saves slides, asks questions.

---

## Deployment

| Detail | Value |
|---|---|
| App path | `/var/www/viewcake` |
| PM2 process name | `viewcake` |
| Local port | `3020` |
| Public URL | `https://viewcake.brightening.ca` |
| Tunnel | Cloudflare (`cloudflared`) — tunnels public URL to `localhost:3020` |

---

## System Dependencies

```bash
# PostgreSQL (14+)
sudo apt install postgresql postgresql-contrib -y

# Poppler — PDF-to-image rendering
sudo apt install poppler-utils -y

# Node.js (20+)
# Use nvm or your preferred method
```

---

## First-Time Setup

```bash
cd /var/www/viewcake

# 1. Install Node dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — fill in DATABASE_URL, AUTH_SECRET, APP_URL

# 3. Create PostgreSQL user and database
sudo -u postgres psql <<SQL
CREATE USER viewcake_user WITH PASSWORD 'your-password';
CREATE DATABASE viewcake OWNER viewcake_user;
GRANT ALL ON SCHEMA public TO viewcake_user;
SQL

# 4. Run migrations
npx prisma migrate deploy

# 5. Build
npm run build

# 6. Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

---

## Routine Deployment (Updates)

```bash
cd /var/www/viewcake

npm run build
pm2 restart viewcake
pm2 save
```

---

## Route Map

### Presenter (requires login)

| Route | Purpose |
|---|---|
| `/login` | Sign in |
| `/register` | Create a presenter account |
| `/dashboard` | Overview: presentations, session stats |
| `/presentations` | List all presentations |
| `/presentations/new` | Upload a PDF deck, create presentation |
| `/presentations/[id]` | View presentation, slides, sessions, share links |
| `/sessions/[id]/presenter` | Live presenter console — slide control, join code, questions |
| `/sessions/[id]/summary` | Post-session review — participants, saves, questions, export |

### Audience (public — no login required)

| Route | Purpose |
|---|---|
| `/join` | Enter a session join code |
| `/live/[code]` | Follow the live session; save slides, ask questions, add notes, get takeaways link |
| `/s/[shareSlug]` | View a single shared slide via public link |
| `/takeaways/[token]` | Private takeaways page — saved slides, notes, questions for one participant |

---

## Architecture

One Next.js 15 App Router application. No separate backend service.

- Server Actions handle all mutations
- Route Handlers serve uploaded slide images
- Prisma + PostgreSQL for all data
- JWT sessions via Auth.js v5 (next-auth)
- Middleware protects presenter routes at the edge

---

## Data Models

| Model | Description |
|---|---|
| `User` | Presenter account (email + hashed password) |
| `Presentation` | Uploaded deck — title, description, deckPath, status |
| `Slide` | One page from a presentation — order, imagePath |
| `LiveSession` | One live event — join code, currentSlideIndex, status |
| `AudienceParticipant` | A named viewer who joined a session |
| `SlideAnnotation` | Note (`isPublic=false`) or question (`isPublic=true`) on a slide |
| `SlideSave` | Audience member bookmarking a slide |
| `SlideShare` | Public share link for a single slide (`/s/[shareSlug]`) |
| `EngagementEvent` | Event log: SAVE, NOTE, QUESTION |

---

## File Storage

Uploads are stored on disk, not in Git or any object store.

| Path | Contents |
|---|---|
| `uploads/decks/` | Uploaded PDF files — named `<uuid>-<original>.pdf` |
| `uploads/slides/<presentationId>/` | Rendered PNG images — named `slide-N.png` |

The `uploads/` directory is `.gitignore`d. It must be backed up separately — see [Backup](#backup).

Slide images are served via `GET /api/uploads/slides/[presentationId]/[filename]`.

### PDF-to-slide Extraction

On upload, each PDF page is rendered to PNG using Poppler (`pdftoppm -r 150 -png`). One `Slide` record is created per page. If rendering fails, one placeholder `Slide` is created and the presentation status stays `DRAFT`. A successful render sets status to `READY`.

---

## Environment Variables

See `.env.example` for the full list. Required in production:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | JWT signing secret — generate with `openssl rand -base64 32` |
| `AUTH_URL` | Canonical base URL of the app — used by Auth.js for redirects |
| `APP_URL` | Same as AUTH_URL in most setups |

---

## Backup

### Uploads (PDF decks + slide images)

Git does not back up `uploads/`. Back it up separately:

```bash
# Snapshot uploads to a dated tarball
tar -czf /backups/viewcake-uploads-$(date +%Y%m%d).tar.gz /var/www/viewcake/uploads/

# Or rsync to a remote host
rsync -avz /var/www/viewcake/uploads/ user@backup-host:/backups/viewcake/uploads/
```

### PostgreSQL Database

```bash
# Dump the database
PGPASSWORD="your-password" pg_dump -U viewcake_user -h localhost viewcake \
  > /backups/viewcake-db-$(date +%Y%m%d).sql

# Restore from a dump
PGPASSWORD="your-password" psql -U viewcake_user -h localhost viewcake \
  < /backups/viewcake-db-20260519.sql
```

A cron job example (daily at 2am):

```cron
0 2 * * * tar -czf /backups/viewcake-uploads-$(date +\%Y\%m\%d).tar.gz /var/www/viewcake/uploads/ && PGPASSWORD="pw" pg_dump -U viewcake_user viewcake > /backups/viewcake-db-$(date +\%Y\%m\%d).sql
```

---

## Health Check

```bash
bash /var/www/viewcake/scripts/health-check.sh
```

---

## Audience Takeaways

Each audience participant gets a private takeaways page at `/takeaways/[token]`. The token is an unguessable UUID stored in the participant's browser localStorage and in the database.

The takeaways page shows:
- Presentation title, session code, and date (when the session started)
- Saved slides with clickable thumbnails (click to open full-size view)
- Private notes grouped by slide
- Questions asked
- Copy link / copy plain-text export

Slide thumbnails are clickable — clicking opens a fullscreen lightbox. Press Escape or click outside to close.

Audience participants can also save their email on the live page. The email is stored on the `AudienceParticipant` record. **Email delivery is not yet configured** — the email is saved but no message is sent. The takeaways link is always accessible directly.

There are no audience accounts or passwords. The token is the only credential.

---

## Known Limitations (MVP)

- No WebSocket/SSE — audience polling uses `router.refresh()` every 3 s (up to 3 s lag)
- No PowerPoint/PPTX support — PDF only
- No email delivery — audience email is captured but not sent (no provider configured)
- No audience accounts — takeaways are token-only, no login
- No payments or billing
- No team/organization support
- No AI features
- File uploads are local disk only — no S3 or object store
- No automated backup — manual steps required (see above)
- `uploads/` is not replicated across servers (single-node only)
- Participant count on presenter view updates on polling interval, not instantly
