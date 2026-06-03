# Tech Stack

![Video Review Platform](https://img.shields.io/badge/Video_Review_Platform-111827?style=for-the-badge)
![Client Feedback](https://img.shields.io/badge/Client_Feedback-2563EB?style=for-the-badge)
![Timestamp Comments](https://img.shields.io/badge/Timestamp_Comments-7C3AED?style=for-the-badge)
![Project Approval](https://img.shields.io/badge/Project_Approval-0F766E?style=for-the-badge)
![Media Workflow](https://img.shields.io/badge/Media_Workflow-E11D48?style=for-the-badge)
![Revision Tracking](https://img.shields.io/badge/Revision_Tracking-F97316?style=for-the-badge)
![Asset Delivery](https://img.shields.io/badge/Asset_Delivery-475569?style=for-the-badge)
![Production Server](https://img.shields.io/badge/Production_Server-DC2626?style=for-the-badge)

# Viewcake

Viewcake is a real-time presentation amplification platform.

A presenter uploads a PDF deck, starts a live session, and shares a short join code. Audience members join from any device, follow along, save slides, add notes, ask questions, and share individual slides.

> Make presentations live beyond the room.

---

## What Viewcake Is

Viewcake sits beside your existing presentation tool — PowerPoint, Keynote, Google Slides, Canva. Create your deck wherever you already work, export it as a PDF, and use Viewcake as the live audience layer.

---

## Current MVP Status

The core product loop is complete and running at **https://viewcake.brightening.ca**.

### What works today

- Presenter account creation and login
- PDF deck upload with automatic slide image extraction (Poppler / `pdftoppm`)
- Presentation and slide management
- Live session creation with short join codes
- Presenter console — slide navigation, join code, participant count, live question feed
- Audience live view — follows presenter, slide updates via polling (~3 s)
- Audience join gate — name prompt, identity persisted in browser
- Save slides, add private notes, ask questions (audience)
- Session status controls — Go Live, End Session
- Post-session summary — participants, per-slide engagement, questions, export as text
- Public slide share links (`/s/[slug]`)
- Route protection — presenter routes require login, audience routes are public

### Not yet built

- WebSocket / SSE real-time sync (audience uses polling at 3 s interval)
- PowerPoint / PPTX support — PDF only
- Email notifications
- Payments and billing
- Team / organization accounts
- AI features (summaries, smart extraction)
- Object storage — uploads are local disk only
- Mobile-optimised presenter view

---

## Technical Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js v5 (JWT, Credentials provider)
- Poppler (`poppler-utils`) for PDF-to-image rendering
- Local file storage (`uploads/`)

---

## Quick Start (Development)

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, APP_URL
npx prisma migrate dev
npm run dev
```

## Production

See **[docs/README.md](docs/README.md)** for full production setup, PM2 config, backup instructions, and health check.

---

## Core Data Models

| Model | Purpose |
|---|---|
| `User` | Presenter account |
| `Presentation` | Uploaded PDF deck |
| `Slide` | One rendered page / image |
| `LiveSession` | One live event with a join code |
| `AudienceParticipant` | A named viewer who joined |
| `SlideAnnotation` | Private note or public question on a slide |
| `SlideSave` | Saved slide bookmark |
| `SlideShare` | Public share link for one slide |
| `EngagementEvent` | Event log — SAVE, NOTE, QUESTION |

---

## File Storage

```
uploads/decks/      — uploaded PDF files  (not in Git)
uploads/slides/     — rendered slide PNGs (not in Git)
```

Both directories must be backed up separately. See [docs/README.md](docs/README.md#backup).
