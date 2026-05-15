"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function advanceSlide(
  sessionId: string,
  direction: "next" | "prev"
): Promise<void> {
  const session = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    include: { presentation: { select: { slides: { select: { id: true } } } } },
  });

  if (!session) return;

  const total = session.presentation.slides.length;
  if (total === 0) return;

  const current = session.currentSlideIndex;
  const next =
    direction === "next"
      ? Math.min(current + 1, total - 1)
      : Math.max(current - 1, 0);

  if (next === current) return; // already at boundary

  await prisma.liveSession.update({
    where: { id: sessionId },
    data: { currentSlideIndex: next },
  });

  revalidatePath(`/sessions/${sessionId}/presenter`);
}

export async function goToSlide(
  sessionId: string,
  index: number
): Promise<void> {
  const session = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    include: { presentation: { select: { slides: { select: { id: true } } } } },
  });

  if (!session) return;

  const total = session.presentation.slides.length;
  if (total === 0) return;

  const clamped = Math.max(0, Math.min(index, total - 1));

  await prisma.liveSession.update({
    where: { id: sessionId },
    data: { currentSlideIndex: clamped },
  });

  revalidatePath(`/sessions/${sessionId}/presenter`);
}
