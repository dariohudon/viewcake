import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";
import PresenterSidebar from "@/components/presenter/presenter-sidebar";
import SlidePoller from "@/components/audience/slide-poller";
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
  const activeSlide = rawSlides[currentIndex] ?? null;
  const isLive = session.status === "LIVE";
  const isPending = session.status === "PENDING";

  // Resolve image URLs server-side so only plain strings reach client components
  const slides = rawSlides.map((s) => ({
    id: s.id,
    order: s.order,
    title: s.title,
    imageUrl: s.imagePath ? slideImageUrl(s.imagePath) : null,
  }));

  // Strip Date objects — sidebar only needs body, participant name, and slide order
  const serialisableQuestions = questions.map((q) => ({
    id: q.id,
    body: q.body,
    participant: q.participant ? { displayName: q.participant.displayName } : null,
    slide: q.slide ? { order: q.slide.order } : null,
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Polls every 5s so participant count and questions stay fresh */}
      <SlidePoller intervalMs={5000} />

      {/* Session header bar */}
      <header className="border-b border-gray-800 px-6 h-14 flex items-center justify-between shrink-0">
        <span className="text-sm font-semibold text-white">Viewcake</span>
        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Join code</p>
            <p className="text-lg font-bold tracking-widest text-white font-mono">
              {session.code}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Slide</p>
            <p className="text-lg font-bold text-white tabular-nums">
              {rawSlides.length > 0 ? `${currentIndex + 1} / ${rawSlides.length}` : "—"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Participants</p>
            <p className="text-lg font-bold text-white">{participantCount}</p>
          </div>

          {/* Status badge */}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isLive
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {session.status.toLowerCase()}
          </span>

          {/* Go Live (only when pending) */}
          {isPending && (
            <form
              action={async () => {
                "use server";
                await setSessionLive(id);
              }}
            >
              <button
                type="submit"
                className="rounded-lg bg-green-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Go Live
              </button>
            </form>
          )}

          {/* End session */}
          <form action={endSession}>
            <input type="hidden" name="sessionId" value={id} />
            <button
              type="submit"
              className="rounded-lg bg-red-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-red-700 transition-colors"
            >
              End session
            </button>
          </form>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide canvas */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl aspect-video bg-gray-800 rounded-xl overflow-hidden relative flex items-center justify-center">
            {activeSlide?.imagePath ? (
              <Image
                src={slideImageUrl(activeSlide.imagePath)}
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

        {/* Right sidebar */}
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
