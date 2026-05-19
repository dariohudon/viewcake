# Sprint A: Live Audience Engagement MVP

## Goal

/goal Finish Sprint A: Live Audience Engagement MVP. Audience Join Gate is already implemented and working. Complete Save Slide, private notes, audience questions, session status controls, presenter activity panel, and basic EngagementEvent tracking. Build must pass, PM2 must restart, and viewcake.brightening.ca must return 200.

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
- Presentation upload works
- PDF-to-image extraction works
- Presentation detail page shows real slide thumbnails
- Live presenter view renders active slide images
- Audience live view renders active slide images
- Presenter Prev / Next updates LiveSession.currentSlideIndex
- Presenter sidebar slide jump works
- Audience sync works through polling every 3 seconds
- Audience Join Gate has already been implemented and committed
- Audience users can already enter a display name and join a live session

Goal of this sprint:
Finish Sprint A: Live Audience Engagement MVP.

This sprint completes:
007 Save Slide
008 Notes
009 Questions
010 Session Status
011 Presenter Activity Panel
012 Basic Engagement Events

Do not rebuild the Audience Join Gate. Inspect and extend the existing JoinGate/actions implementation.

Do not overbuild.
Do not add authentication.
Do not add payments.
Do not add AI.
Do not add WebSockets.
Do not add Socket.IO.
Do not add Server-Sent Events yet.
Do not add public share pages yet.
Do not add CSV export yet.
Do not refactor unrelated routes.
Do not change PDF rendering unless absolutely necessary.

Before editing:
1. Inspect prisma/schema.prisma
2. Inspect app/live/[code]/page.tsx
3. Inspect app/live/actions.ts
4. Inspect components/audience/join-gate.tsx
5. Inspect app/sessions/[id]/presenter/page.tsx
6. Inspect app/sessions/actions.ts
7. Inspect existing presenter controls and audience polling
8. Inspect SlideSave, SlideAnnotation, AudienceParticipant, and EngagementEvent model fields
9. Run npm run build
10. Report a concise implementation plan before changing files

Feature requirements:

PART 1 — Save Slide

1. On the audience live view:
- Save Slide button should create a SlideSave record for participant + slide
- Prevent duplicate saves for the same participant + slide
- Button should show Saved if already saved
- Saved state should persist after refresh

2. Presenter view:
- Show save count for the current slide
- Show total save count for the session if simple

PART 2 — Notes

1. On the audience live view:
- Add a private note field for the current slide
- Save note to SlideAnnotation or the most appropriate existing model
- Tie notes to participant + slide + session if schema supports it
- Notes should reload when the same participant views that slide again
- Notes should be private to the participant for MVP

PART 3 — Questions

1. On the audience live view:
- Add a question field for the current slide
- Submit question to SlideAnnotation or EngagementEvent, whichever fits the schema best
- Tie question to participant + slide + session

2. Presenter view:
- Show recent audience questions
- Include participant display name, slide number, question text, and timestamp if simple

PART 4 — Session Status

1. Presenter view:
- Add Start/Go Live and End Session controls if not already present
- Update LiveSession.status appropriately

2. Audience view:
- If session is ended, show a clear “Session ended” message
- Do not let status handling break the current working live slide flow

PART 5 — Presenter Activity Panel

Add a simple presenter activity panel showing:
- Participant count
- Current slide save count
- Total session save count
- Recent questions
- Current session status
- Join code

PART 6 — Engagement Events

Create basic EngagementEvent records for important actions where practical:
- joined_session if not already created by JoinGate
- saved_slide
- added_note
- asked_question
- changed_slide for presenter if simple

Avoid noisy duplicate viewed_slide events.

PART 7 — Data Integrity

- Avoid duplicate participants on refresh
- Avoid duplicate saves per participant/slide
- Validate required fields server-side
- Gracefully handle missing/ended sessions
- Preserve existing image rendering

PART 8 — Build and Deploy

After implementation:
1. Run npm run build
2. If migrations are needed:
   - create the migration
   - run npx prisma migrate deploy
3. Restart PM2:
   pm2 restart viewcake
   pm2 save
4. Verify:
   curl -I http://localhost:3020
   curl -I https://viewcake.brightening.ca

Manual browser test:
1. Open presenter session
2. Open audience /live/[code] in another tab
3. Join as a named participant
4. Confirm presenter participant count increases
5. Save a slide
6. Confirm saved state persists
7. Add a note
8. Ask a question
9. Confirm presenter can see the question
10. Click Next as presenter
11. Confirm audience still follows through polling

After implementation, report:
1. Files changed
2. Schema/migration changes, if any
3. How saves are deduped
4. How notes are stored
5. How questions are stored
6. What engagement events are created
7. How session status works
8. Build result
9. PM2 restart result
10. Manual test results
11. Known limitations

Important:
Keep this focused. If a sub-feature becomes risky, implement the safer minimal version and clearly document the limitation rather than expanding scope.

Begin with audit and implementation plan.
