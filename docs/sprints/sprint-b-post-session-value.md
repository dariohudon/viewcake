# Sprint B: Post-Session Value + Product Hardening

## Goal

/goal Implement Sprint B: Post-Session Value + Product Hardening. Add a session summary page, public slide share pages, simple export/copyable session data, and stronger UI states. Presenter should be able to review participants, saves, notes/questions, and slide-level engagement after a session. Public slide share links should work. Build must pass, PM2 must restart, and viewcake.brightening.ca must return 200.

## Prompt

You are Claude Code acting as the IMPLEMENTER.

We are working in:

/var/www/viewcake

Current state:
- Viewcake is live at https://viewcake.brightening.ca
- PM2 process name: viewcake
- App runs locally on port 3020
- Next.js 15 App Router
- TypeScript
- Tailwind
- Prisma
- PostgreSQL
- Sprint A should already be complete:
  - AudienceParticipants exist
  - Save Slide works
  - Notes work
  - Questions work
  - Session status works
  - Presenter activity panel exists
  - EngagementEvent records exist for key actions

Goal of this sprint:
Implement post-session value and product hardening.

This sprint combines:
013 Session Summary
014 Public Slide Share
015 Export / Copy Follow-up
016 UI States
018 Deployment Hygiene, lightweight only

Do not overbuild.
Do not add authentication.
Do not add payments.
Do not add AI.
Do not add WebSockets.
Do not refactor the whole app.

Before editing:
1. Inspect prisma/schema.prisma
2. Inspect app/sessions/[id]/presenter/page.tsx
3. Inspect app/live/[code]/page.tsx
4. Inspect app/sessions/actions.ts
5. Inspect app/s/[shareSlug]/page.tsx
6. Run npm run build
7. Report a concise implementation plan before changing files

Feature requirements:

PART 1 — Session Summary Page

Create or complete:

/sessions/[id]/summary

The page should show:
- Presentation title
- Session code
- Session status
- Started/ended timestamps if available
- Total participants
- Total saves
- Total questions
- Total notes if appropriate
- Most saved slides
- Recent questions
- Slide-by-slide engagement table or card list

PART 2 — Link from Presenter Console

On /sessions/[id]/presenter:
- Add a link/button to View Summary
- If session is ended, make summary more prominent
- Do not break existing presenter slide controls

PART 3 — Public Slide Share

Complete or improve:

/s/[shareSlug]

Minimum MVP:
- Add a Share Slide action where appropriate
- Create a SlideShare record
- Generate or reuse a shareSlug
- Public page should show slide image, presentation title, slide number, and Viewcake branding
- Do not require login
- Do not expose local filesystem paths
- Use existing slide image API route

PART 4 — Export / Copy Follow-up

Add a simple output option on the session summary page:
- Copyable plain-text summary block preferred
- Include participant count, top saved slides, and questions

PART 5 — UI States

Improve basic UI states:
- Upload/rendering failure message where currently known
- No slides found
- No participant activity yet
- No questions yet
- Session ended
- Missing session
- Missing presentation
- Public slide not found

PART 6 — Deployment Hygiene, lightweight

Add or update docs with:
- PM2 process name
- Local port
- Public URL
- Cloudflare tunnel note
- Upload storage paths
- Poppler dependency
- Migration command
- Basic deploy commands

After implementation:
1. Run npm run build
2. If migrations are needed, run npx prisma migrate deploy
3. Restart PM2:
   pm2 restart viewcake
   pm2 save
4. Verify:
   curl -I http://localhost:3020
   curl -I https://viewcake.brightening.ca

Manual browser test:
1. Open a completed or active session
2. Submit at least one save/question/note from audience if needed
3. Open /sessions/[id]/summary
4. Confirm summary numbers appear
5. Create/share a public slide link
6. Open /s/[shareSlug]
7. Confirm slide image appears
8. Confirm export/copy summary exists

After implementation, report:
1. Files changed
2. Schema/migration changes, if any
3. Summary page behavior
4. Public share behavior
5. Export/copy behavior
6. UI states added
7. Docs updated
8. Build result
9. PM2 restart result
10. Manual test results
11. Known limitations

Begin with audit and implementation plan.
