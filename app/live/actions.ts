"use server";

import { prisma } from "@/lib/prisma";

export async function joinSession(
  sessionId: string,
  displayName: string
): Promise<{ participantId: string; takeawayToken: string }> {
  const name = displayName.trim().slice(0, 60) || "Anonymous";
  const takeawayToken = crypto.randomUUID();

  const participant = await prisma.audienceParticipant.create({
    data: { sessionId, displayName: name, takeawayToken },
  });

  return { participantId: participant.id, takeawayToken };
}

export async function updateLastSeen(participantId: string): Promise<void> {
  await prisma.audienceParticipant
    .update({ where: { id: participantId }, data: { lastSeenAt: new Date() } })
    .catch(() => undefined);
}

// Lazy token creation for participants who joined before this feature existed.
export async function getOrCreateToken(
  participantId: string
): Promise<{ takeawayToken: string }> {
  const participant = await prisma.audienceParticipant.findUnique({
    where: { id: participantId },
    select: { takeawayToken: true },
  });

  if (!participant) throw new Error("Participant not found");

  if (participant.takeawayToken) {
    return { takeawayToken: participant.takeawayToken };
  }

  const token = crypto.randomUUID();
  await prisma.audienceParticipant.update({
    where: { id: participantId },
    data: { takeawayToken: token },
  });

  return { takeawayToken: token };
}

export type SaveEmailResult = { error: string | null };

export async function saveEmail(
  participantId: string,
  email: string
): Promise<SaveEmailResult> {
  const trimmed = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { error: "Please enter a valid email address." };
  }

  await prisma.audienceParticipant
    .update({ where: { id: participantId }, data: { email: trimmed } })
    .catch(() => undefined);

  return { error: null };
}

export async function saveSlide(
  participantId: string,
  slideId: string,
  sessionId: string
): Promise<void> {
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
