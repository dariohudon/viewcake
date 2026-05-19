# Viewcake Sprint Queue

This folder stores the Claude Code sprint queue for Viewcake.

Workflow:

1. Run: ./scripts/next-sprint.sh
2. Copy the printed Goal into Claude Code.
3. Copy the printed Prompt into Claude Code.
4. Claude completes the sprint, builds, restarts PM2, verifies, reports, and stops.
5. Human reviews, tests, commits, and pushes.
6. Run: ./scripts/advance-sprint.sh
7. Repeat.

Claude should complete one sprint at a time and stop for review.
