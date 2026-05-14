"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
      slideCount: 1,
      status: "DRAFT",
    },
  });

  // One placeholder slide per presentation.
  // Full PDF-to-image extraction is future work — see docs/README.md.
  await prisma.slide.create({
    data: { presentationId: presentation.id, order: 1 },
  });

  redirect(`/presentations/${presentation.id}`);
}
