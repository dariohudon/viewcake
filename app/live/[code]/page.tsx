import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";
import SlidePoller from "@/components/audience/slide-poller";
import JoinGate from "@/components/audience/join-gate";
import AudienceActions from "@/components/audience/audience-actions";
import AudienceNotes from "@/components/audience/audience-notes";

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

        <header className="border-b border-gray-200 px-5 h-12 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Viewcake</span>
          <span className="text-xs font-mono text-gray-400 tracking-widest">
            {session.code}
          </span>
        </header>

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

          <AudienceActions
            sessionId={session.id}
            sessionCode={session.code}
            slideId={activeSlide?.id ?? null}
          />
        </div>

        <AudienceNotes
          sessionId={session.id}
          sessionCode={session.code}
          slideId={activeSlide?.id ?? null}
        />
      </div>
    </JoinGate>
  );
}
