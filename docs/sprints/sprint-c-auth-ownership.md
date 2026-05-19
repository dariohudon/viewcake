# Sprint C: Auth + Ownership

## Goal

/goal Implement Sprint C: Auth + Ownership. Add basic presenter authentication and route protection so presentations and sessions belong to a signed-in user. Existing unauthenticated MVP data should not be destroyed. Dashboard and presentation routes should require login, while audience join/live/share routes should remain public. Build must pass, migrations must deploy if needed, PM2 must restart, and viewcake.brightening.ca must return 200.

## Prompt

You are Claude Code acting as the IMPLEMENTER.

We are working in:

/var/www/viewcake

Goal of this sprint:
Implement basic presenter authentication and ownership.

This sprint covers:
017 Auth
Presenter ownership
Route protection
Public audience routes remain public

Do not overbuild.
Do not add payments.
Do not add teams/organizations.
Do not add complex roles.
Do not add OAuth unless already trivial.
Do not break public audience join/live/share routes.
Do not destroy existing MVP data.

Before editing:
1. Inspect prisma/schema.prisma
2. Inspect app/login/page.tsx
3. Inspect app/dashboard/page.tsx
4. Inspect app/presentations/page.tsx
5. Inspect app/presentations/new/page.tsx
6. Inspect app/presentations/actions.ts
7. Inspect app/sessions routes
8. Inspect package.json for auth dependencies
9. Inspect .env.example
10. Run npm run build
11. Report a concise implementation plan before changing files

Feature requirements:

PART 1 — Simple Auth

Use the simplest reliable approach:
- Auth.js / NextAuth if already installed or easy
- Email/password if safer
- Simple httpOnly session cookie acceptable for MVP
- Do not store plain-text passwords

PART 2 — Login

Implement /login:
- Presenter can sign in
- If no user exists, allow creating the first user or provide a setup path
- Minimal UI

PART 3 — Route Protection

Protect:
- /dashboard
- /presentations
- /presentations/new
- /presentations/[id]
- /sessions/[id]/presenter
- /sessions/[id]/summary

Keep public:
- /
- /join
- /live/[code]
- /s/[shareSlug]
- /api/uploads/slides/[presentationId]/[filename]

PART 4 — Ownership

When creating a presentation:
- Set Presentation.userId to current user
- Sessions should be associated with presenter where schema supports it

When listing presentations:
- Show only signed-in user's presentations
- Handle legacy null-user data safely
- Do not delete legacy data

PART 5 — UI

Add:
- Signed-in user indicator if simple
- Logout button
- Redirect protected routes to /login
- Redirect /login to /dashboard if signed in

PART 6 — Security

- Passwords hashed if password auth
- Sessions/cookies httpOnly if possible
- Do not commit .env
- Keep audience routes frictionless

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
1. Visit /dashboard logged out
2. Confirm redirect to /login
3. Create or sign in as presenter
4. Create/upload presentation
5. Confirm it belongs to signed-in user
6. Start a session
7. Confirm presenter console works
8. Confirm /live/[code] still works publicly
9. Confirm /s/[shareSlug] still works publicly

After implementation, report:
1. Files changed
2. Auth approach chosen and why
3. Schema/migration changes, if any
4. Which routes are protected
5. Which routes remain public
6. How ownership works
7. How legacy null-user data is handled
8. Build result
9. PM2 restart result
10. Manual test results
11. Known limitations

Begin with audit and implementation plan.
