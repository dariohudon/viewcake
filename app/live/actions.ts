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

export async function updateLastSeen(participantId: string): Promise<void> {
  await prisma.audienceParticipant
    .update({ where: { id: participantId }, data: { lastSeenAt: new Date() } })
    .catch(() => undefined);
}

export async function saveSlide(
  participantId: string,
  slideId: string,
  sessionId: string
): Promise<void> {
  // SlideSave has a unique constraint — skip if already saved
  await prisma.slideSave
    .create({ data: { participantId, slideId } })
    .catch(() => undefined);

  await prisma.engagementEvent.create({
    data: { type: "SAVE", sessionId, slideId, participantId },
  });
}

export async function saveNote(
  participantId: string,
  slideId: string,
  sessionId: string,
  body: string
): Promise<void> {
  const trimmed = body.trim();
  if (!trimmed) return;

  await prisma.slideAnnotation.create({
    data: { participantId, slideId, body: trimmed, isPublic: false },
  });

  await prisma.engagementEvent.create({
    data: { type: "NOTE", sessionId, slideId, participantId },
  });
}

export async function askQuestion(
  participantId: string,
  slideId: string,
  sessionId: string,
  body: string
): Promise<void> {
  const trimmed = body.trim();
  if (!trimmed) return;

  await prisma.slideAnnotation.create({
    data: { participantId, slideId, body: trimmed, isPublic: true },
  });

  await prisma.engagementEvent.create({
    data: {
      type: "QUESTION",
      sessionId,
      slideId,
      participantId,
      metadata: { body: trimmed },
    },
  });
}
