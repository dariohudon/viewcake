# Sprint D: Deployment Hardening + MVP Cleanup

## Goal

/goal Implement Sprint D: Deployment Hardening + MVP Cleanup. Add production-safe documentation, PM2 ecosystem config if appropriate, health checks, backup notes for uploads/database, error-state cleanup, and final MVP README updates. Build must pass, PM2 must restart, and viewcake.brightening.ca must return 200.

## Prompt

You are Claude Code acting as the IMPLEMENTER.

We are working in:

/var/www/viewcake

Goal of this sprint:
Harden deployment and clean up MVP documentation and operational safety.

Do not overbuild.
Do not add new product features.
Do not refactor app architecture.
Do not change auth/product behavior unless required to fix obvious issues.
Do not add Docker unless already present and trivial.
Do not break the running PM2 deployment.

Before editing:
1. Inspect README.md
2. Inspect docs/README.md
3. Inspect package.json
4. Inspect prisma/schema.prisma
5. Inspect .env.example
6. Inspect existing scripts/
7. Inspect PM2 usage if any config exists
8. Run npm run build
9. Report a concise implementation plan before changing files

Feature requirements:

PART 1 — Deployment Docs

Update docs with:
- App path: /var/www/viewcake
- PM2 process name: viewcake
- Local port: 3020
- Public URL: https://viewcake.brightening.ca
- Cloudflare tunnel note
- PostgreSQL requirement
- Poppler dependency:
  sudo apt install poppler-utils -y
- Migration command:
  npx prisma migrate deploy
- Build command:
  npm run build
- Restart:
  pm2 restart viewcake
  pm2 save

PART 2 — Environment Docs

Update .env.example and docs:
- DATABASE_URL
- APP_URL
- AUTH_SECRET or whatever auth requires
- PORT if used
- Upload path assumptions

Do not include real secrets.

PART 3 — PM2 Config

If useful, add ecosystem.config.js:
- name: viewcake
- cwd: /var/www/viewcake
- command: npm
- args: start -- -p 3020
- env production values only if safe and non-secret

Do not break current PM2 setup.

PART 4 — Health Check Script

Add:

scripts/health-check.sh

It should check:
- localhost:3020
- https://viewcake.brightening.ca

PART 5 — Backup Notes

Document:
- uploads/
- uploads/decks/
- uploads/slides/
- PostgreSQL backup requirement
- Git does not back up uploads
- Suggested backup commands if simple

PART 6 — MVP Cleanup

Review outdated text:
- Remove notes saying PDF extraction is not implemented
- Ensure sprint docs reflect current state
- Ensure README describes current MVP accurately
- List known limitations honestly

After implementation:
1. Run npm run build
2. Restart PM2:
   pm2 restart viewcake
   pm2 save
3. Verify:
   curl -I http://localhost:3020
   curl -I https://viewcake.brightening.ca
4. Run scripts/health-check.sh if created

After implementation, report:
1. Files changed
2. Docs updated
3. Scripts added
4. PM2 config added or not, with reason
5. Health check result
6. Build result
7. PM2 restart result
8. Public URL result
9. Known limitations

Begin with audit and implementation plan.
