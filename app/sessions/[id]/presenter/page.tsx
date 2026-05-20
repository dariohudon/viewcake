import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";
import PresenterSidebar from "@/components/presenter/presenter-sidebar";
import MobilePresenterControls from "@/components/presenter/mobile-presenter-controls";
import SlidePoller from "@/components/audience/slide-poller";
import ViewcakeLogo from "@/components/brand/viewcake-logo";
import { endSession, setSessionLive } from "@/app/sessions/actions";

export const dynamic = "force-dynamic";

export default async function PresenterSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [session, participantCount, questions] = await Promise.all([
    prisma.liveSession.findUnique({
      where: { id },
      include: {
        presentation: {
          select: {
            id: true,
            title: true,
            slides: { orderBy: { order: "asc" } },
          },
        },
      },
    }),
    prisma.audienceParticipant.count({ where: { sessionId: id } }),
    prisma.slideAnnotation.findMany({
      where: {
        isPublic: true,
        participant: { sessionId: id },
      },
      include: {
        participant: { select: { displayName: true } },
        slide: { select: { order: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  if (!session) notFound();

  const rawSlides = session.presentation.slides;
  const currentIndex = Math.max(
    0,
    Math.min(session.currentSlideIndex, rawSlides.length - 1)
  );
  const isLive = session.status === "LIVE";
  const isPending = session.status === "PENDING";

  const slides = rawSlides.map((s) => ({
    id: s.id,
    order: s.order,
    title: s.title,
    imageUrl: s.imagePath ? slideImageUrl(s.imagePath) : null,
  }));

  const activeSlide = slides[currentIndex] ?? null;

  const serialisableQuestions = questions.map((q) => ({
    id: q.id,
    body: q.body,
    participant: q.participant ? { displayName: q.participant.displayName } : null,
    slide: q.slide ? { order: q.slide.order } : null,
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <SlidePoller intervalMs={5000} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 px-3 sm:px-6 h-14 flex items-center justify-between shrink-0 gap-2">
        <ViewcakeLogo size="sm" iconOnly />

        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-none">

          {/* Join code */}
          <div className="text-center shrink-0">
            <p className="hidden sm:block text-xs text-gray-400 uppercase tracking-wide">
              Join code
            </p>
            <p className="text-sm sm:text-lg font-bold tracking-widest text-white font-mono">
              {session.code}
            </p>
          </div>

          {/* Slide counter */}
          <div className="text-center shrink-0">
            <p className="hidden sm:block text-xs text-gray-400 uppercase tracking-wide">
              Slide
            </p>
            <p className="text-sm sm:text-lg font-bold text-white tabular-nums">
              {rawSlides.length > 0
                ? `${currentIndex + 1}/${rawSlides.length}`
                : "—"}
            </p>
          </div>

          {/* Participants — hidden on mobile */}
          <div className="hidden sm:block text-center shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Participants
            </p>
            <p className="text-lg font-bold text-white">{participantCount}</p>
          </div>

          {/* Status badge — hidden on mobile */}
          <span
            className={`hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${
              isLive
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {session.status.toLowerCase()}
          </span>

          {/* Go Live */}
          {isPending && (
            <form
              action={async () => {
                "use server";
                await setSessionLive(id);
              }}
            >
              <button
                type="submit"
                className="rounded-lg bg-green-600 text-white px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors shrink-0"
              >
                <span className="sm:hidden">Live</span>
                <span className="hidden sm:inline">Go Live</span>
              </button>
            </form>
          )}

          {/* End session */}
          <form action={endSession}>
            <input type="hidden" name="sessionId" value={id} />
            <button
              type="submit"
              className="rounded-lg bg-red-600 text-white px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors shrink-0"
            >
              <span className="sm:hidden">End</span>
              <span className="hidden sm:inline">End session</span>
            </button>
          </form>
        </div>
      </header>

      {/* ── Main area ──────────────────────────────────────────── */}
      {/*
        Mobile:  flex-col, scrollable vertically
        Desktop: flex-row, overflow-hidden (sidebar scrolls internally)
      */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

        {/* Slide canvas */}
        <div className="shrink-0 lg:flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-8">
          <div className="w-full lg:max-w-3xl aspect-video bg-gray-800 rounded-xl overflow-hidden relative flex items-center justify-center">
            {activeSlide?.imageUrl ? (
              <Image
                src={activeSlide.imageUrl}
                alt={activeSlide.title ?? `Slide ${activeSlide.order}`}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <p className="text-gray-500 text-sm">
                {slides.length === 0
                  ? "No slides loaded"
                  : session.presentation.title}
              </p>
            )}
          </div>
        </div>

        {/* Mobile controls — hidden on lg+ */}
        <MobilePresenterControls
          sessionId={id}
          currentIndex={currentIndex}
          slides={slides}
          questions={serialisableQuestions}
        />

        {/* Desktop sidebar — hidden below lg */}
        <PresenterSidebar
          sessionId={id}
          currentIndex={currentIndex}
          slides={slides}
          questions={serialisableQuestions}
        />
      </div>
    </div>
  );
}
