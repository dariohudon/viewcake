"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { renderPdf } from "@/lib/pdf/render-pdf";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

function generateCode(length = 6): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

export async function startSession(formData: FormData): Promise<never> {
  const presentationId = (formData.get("presentationId") as string)?.trim();
  if (!presentationId) throw new Error("Missing presentationId");

  // Retry once on code collision (astronomically unlikely but safe)
  let session;
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateCode();
    try {
      session = await prisma.liveSession.create({
        data: { presentationId, code, status: "PENDING" },
      });
      break;
    } catch (e: unknown) {
      if (
        attempt < 2 &&
        e instanceof Error &&
        e.message.includes("Unique constraint")
      ) {
        continue;
      }
      throw e;
    }
  }

  if (!session) throw new Error("Failed to generate a unique session code");

  redirect(`/sessions/${session.id}/presenter`);
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const DECKS_DIR = path.join(process.cwd(), "uploads", "decks");

export type CreatePresentationState = { error: string | null };

export async function createPresentation(
  _prev: CreatePresentationState,
  formData: FormData
): Promise<CreatePresentationState> {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const file = formData.get("deck") as File | null;

  if (!title) return { error: "Title is required." };
  if (!file || file.size === 0) return { error: "Please select a PDF file." };
  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    return { error: "File must be a PDF." };
  }
  if (file.size > MAX_FILE_SIZE) return { error: "File must be under 50 MB." };

  await mkdir(DECKS_DIR, { recursive: true });

  const uid = crypto.randomUUID();
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 100);
  const filename = `${uid}-${safeName}`;
  const diskPath = path.join(DECKS_DIR, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(diskPath, Buffer.from(bytes));

  const presentation = await prisma.presentation.create({
    data: {
      title,
      description,
      originalFilename: file.name,
      deckPath: `uploads/decks/${filename}`,
      slideCount: 0,
      status: "DRAFT",
    },
  });

  let slideCount = 1;
  let status: "DRAFT" | "READY" = "DRAFT";

  try {
    const rendered = await renderPdf(diskPath, presentation.id);
    await prisma.slide.createMany({
      data: rendered.map((s) => ({
        presentationId: presentation.id,
        order: s.order,
        imagePath: s.imagePath,
      })),
    });
    slideCount = rendered.length;
    status = "READY";
  } catch (err) {
    console.error("[pdf] Rendering failed, falling back to placeholder:", err);
    await prisma.slide.create({
      data: { presentationId: presentation.id, order: 1 },
    });
  }

  await prisma.presentation.update({
    where: { id: presentation.id },
    data: { slideCount, status },
  });

  redirect(`/presentations/${presentation.id}`);
}

export async function createSlideShare(formData: FormData): Promise<never> {
  const slideId = (formData.get("slideId") as string)?.trim();
  if (!slideId) throw new Error("Missing slideId");

  const share = await prisma.slideShare.create({
    data: { slideId },
  });

  redirect(`/s/${share.shareSlug}`);
}
