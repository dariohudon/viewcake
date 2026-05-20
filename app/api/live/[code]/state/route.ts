import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const session = await prisma.liveSession.findUnique({
    where: { code: code.toUpperCase() },
    select: {
      status: true,
      currentSlideIndex: true,
      presentation: {
        select: {
          slides: {
            select: { id: true, order: true, title: true, imagePath: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!session) {
    return NextResponse.json(
      { error: "session not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  const slides = session.presentation.slides;
  const clamped = Math.max(
    0,
    Math.min(session.currentSlideIndex, slides.length - 1)
  );
  const raw = slides[clamped] ?? null;

  // Resolve image URL server-side — never expose raw filesystem paths
  const slide = raw
    ? {
        id: raw.id,
        order: raw.order,
        title: raw.title,
        imageUrl: raw.imagePath ? slideImageUrl(raw.imagePath) : null,
      }
    : null;

  return NextResponse.json(
    {
      status: session.status,
      currentSlideIndex: clamped,
      totalSlides: slides.length,
      slide,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
