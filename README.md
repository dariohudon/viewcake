# Viewcake

Viewcake is a real-time presentation amplification platform.

It helps presenters turn a live deck into an interactive audience experience. A presenter uploads a presentation, starts a live session, and receives a short join code. Audience members join from their own device to follow along, save key slides, add notes, ask questions, and eventually share individual slides.

The goal is simple:

> Make presentations live beyond the room.

## What Viewcake Is

Viewcake is not meant to replace PowerPoint, Keynote, Google Slides, or Canva.

Instead, it sits beside them.

A presenter creates their deck wherever they already work, exports it as a PDF, uploads it to Viewcake, and uses Viewcake as the live audience layer.

## Core Product Flow

Presenter logs in
↓
Uploads a PDF deck
↓
Viewcake creates slide records
↓
Presenter starts a live session
↓
Viewcake generates a short join code
↓
Audience goes to the join page
↓
Audience enters the code
↓
Audience follows the presentation live
↓
Audience can save, annotate, ask, and share slides
↓
Presenter reviews post-session engagement

## MVP Scope

The first version of Viewcake is focused on proving the core experience:

- Presenter dashboard
- Presentation creation
- PDF-first deck upload flow
- Slide records
- Live session creation
- Audience join page
- Audience live presentation route
- Slide-level sharing route
- Foundation for annotations, saves, shares, and engagement events

## Not Yet Built

The following features are intentionally out of scope for the first foundation pass:

- Payments
- Organizations / teams
- Full authentication
- AI summaries
- AI slide extraction
- PowerPoint parsing
- Real-time WebSocket control
- Email notifications
- Public marketplace or discovery features
- Advanced analytics dashboards

These can be added after the MVP foundation is stable.

## Planned Experiences

Viewcake is one app with two main experiences.

### Presenter Experience

The presenter side is the control room.

Planned routes:

- /login
- /dashboard
- /presentations
- /presentations/new
- /presentations/[id]
- /sessions/[id]/presenter

The presenter will eventually be able to:

- Log in
- Upload a deck
- Create and manage presentations
- Start a live session
- Control or monitor the active slide
- View audience activity
- Review post-event engagement

### Audience Experience

The audience side is designed to be fast and frictionless.

Planned routes:

- /join
- /live/[code]
- /s/[slideShareId]

The audience will eventually be able to:

- Enter a short session code
- Join a live presentation
- Follow along from their own device
- Save slides
- Add personal notes
- Ask questions
- Share individual slides

## Technical Stack

Current recommended stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL-ready schema
- Local file storage for MVP uploads
- PDF-first presentation handling

## Core Data Models

The MVP architecture is organized around these core objects:

- User
- Presentation
- Slide
- LiveSession
- AudienceParticipant
- SlideAnnotation
- SlideSave
- SlideShare
- EngagementEvent

### Model Intent

- `User` — presenter or account owner
- `Presentation` — uploaded deck and metadata
- `Slide` — individual slide/page from a presentation
- `LiveSession` — one live event using a presentation
- `AudienceParticipant` — anonymous or identified viewer
- `SlideAnnotation` — note or comment attached to a slide
- `SlideSave` — saved slide action
- `SlideShare` — shareable slide record
- `EngagementEvent` — analytics event such as view, save, share, or question

## Local Development

Install dependencies:

npm install

Run the development server:

npm run dev

Build the app:

npm run build

## Environment Variables

Copy the example environment file:

cp .env.example .env

Expected variables:

- DATABASE_URL
- APP_URL
- AUTH_SECRET

Authentication and database wiring may still be placeholder-level depending on the current implementation stage.

## File Storage

For the MVP, uploads are expected to use local storage.

Planned local folders:

- uploads/decks
- uploads/slides

These folders should not be committed to Git.

## Development Principles

Viewcake should stay simple until the core loop is proven.

Guiding rules:

- Build the presenter and audience flow first.
- Avoid overbuilding before a real session works.
- Keep the app PDF-first at the beginning.
- Treat slide-level interaction as the core product.
- Keep AI features separate until the base product is stable.
- Prefer clear architecture over clever abstractions.
- Keep routes and models easy to understand.

## Product Direction

The long-term version of Viewcake should help speakers, educators, consultants, workshops, and event organizers turn presentations into reusable audience assets.

Future possibilities include:

- AI-generated session summaries
- Speaker follow-up reports
- Slide-level engagement analytics
- Lead capture
- Team workspaces
- Audience Q&A
- Exportable content packs
- CRM integrations
- Event landing pages
- Branded audience portals

## Current Status

Viewcake is in early MVP foundation development.

The immediate goal is to create a clean working foundation that supports:

Presentation upload
↓
Slide generation
↓
Live session creation
↓
Audience join
↓
Basic engagement tracking

