# Viewcake Sprint Queue

This folder stores implementation sprints for Claude Code.

Workflow:

1. Read the current sprint file.
2. Paste the `/goal` into Claude Code.
3. Paste the implementation prompt into Claude Code.
4. Claude audits, implements, builds, restarts PM2, verifies, reports, and stops.
5. Human reviews the report.
6. Commit and push.
7. Move to the next sprint.

Important:

Claude should complete one sprint at a time and stop for review. Do not allow Claude to automatically continue into the next sprint without a checkpoint.
