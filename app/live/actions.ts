"use server";

import { prisma } from "@/lib/prisma";

export async function joinSession(
  sessionId: string,
  displayName: string
): Promise<{ participantId: string }> {
  const name = displayName.trim().slice(0, 60) || "Anonymous";

  const participant = await prisma.audienceParticipant.create({
    data: { sessionId, displayName: name },
  });

  return { participantId: participant.id };
}

// Fire-and-forget heartbeat — called on every page load by returning participants.
// Swallows errors so a missing record (e.g., after a DB reset) doesn't break the UX.
export async function updateLastSeen(participantId: string): Promise<void> {
  await prisma.audienceParticipant
    .update({
      where: { id: participantId },
      data: { lastSeenAt: new Date() },
    })
    .catch(() => undefined);
}
