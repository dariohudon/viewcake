import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";
import SlidePoller from "@/components/audience/slide-poller";
import JoinGate from "@/components/audience/join-gate";

export const dynamic = "force-dynamic";

export default async function LiveSessionPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const session = await prisma.liveSession.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      presentation: {
        select: {
          title: true,
          slides: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!session || session.status === "ENDED") notFound();

  const slides = session.presentation.slides;
  const currentIndex = Math.max(
    0,
    Math.min(session.currentSlideIndex, slides.length - 1)
  );
  const activeSlide = slides[currentIndex] ?? null;

  return (
    <JoinGate sessionId={session.id} sessionCode={session.code}>
      <div className="min-h-screen bg-white flex flex-col">
        <SlidePoller />

        {/* Minimal audience header */}
        <header className="border-b border-gray-200 px-5 h-12 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Viewcake</span>
          <span className="text-xs font-mono text-gray-400 tracking-widest">
            {session.code}
          </span>
        </header>

        {/* Slide display */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-sm font-medium text-gray-700">
              {session.presentation.title}
            </p>
            {slides.length > 0 && (
              <span className="text-xs text-gray-400 tabular-nums">
                {currentIndex + 1} / {slides.length}
              </span>
            )}
          </div>

          <div className="w-full max-w-2xl aspect-video bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center mb-6">
            {activeSlide?.imagePath ? (
              <Image
                src={slideImageUrl(activeSlide.imagePath)}
                alt={activeSlide.title ?? `Slide ${activeSlide.order}`}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <p className="text-gray-400 text-sm">
                {slides.length === 0
                  ? "Waiting for presenter to share a slide…"
                  : `Slide ${activeSlide?.order ?? 1}`}
              </p>
            )}
          </div>

          {/* Audience actions */}
          <div className="flex gap-3">
            <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
              Save slide
            </button>
            <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
              Add note
            </button>
            <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
              Ask question
            </button>
          </div>
        </div>

        {/* Notes area */}
        <div className="border-t border-gray-200 px-6 py-4 max-w-2xl mx-auto w-full">
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Your notes for this slide
          </label>
          <textarea
            rows={3}
            placeholder="Type a note…"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>
    </JoinGate>
  );
}
