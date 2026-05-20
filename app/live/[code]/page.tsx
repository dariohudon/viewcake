import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";
import JoinGate from "@/components/audience/join-gate";
import AudienceTakeaways from "@/components/audience/audience-takeaways";
import ViewcakeLogo from "@/components/brand/viewcake-logo";
import LiveSlideView from "@/components/audience/live-slide-view";

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
  const rawActive = slides[currentIndex] ?? null;

  // Resolve image URL server-side for the initial render
  const initialSlide = rawActive
    ? {
        id: rawActive.id,
        order: rawActive.order,
        title: rawActive.title,
        imageUrl: rawActive.imagePath ? slideImageUrl(rawActive.imagePath) : null,
      }
    : null;

  return (
    <JoinGate sessionId={session.id} sessionCode={session.code}>
      <div className="min-h-screen bg-white flex flex-col">

        <header className="border-b border-gray-200 px-5 h-12 flex items-center justify-between shrink-0">
          <ViewcakeLogo size="sm" />
          <span className="text-xs font-mono text-gray-400 tracking-widest">
            {session.code}
          </span>
        </header>

        {/*
          LiveSlideView owns the active slide state and polls
          /api/live/[code]/state every 3s instead of re-rendering
          the whole route. It renders the slide canvas, AudienceActions,
          and AudienceNotes so all three always share the same slideId.
        */}
        <LiveSlideView
          sessionCode={session.code}
          sessionId={session.id}
          presentationTitle={session.presentation.title}
          totalSlides={slides.length}
          initialIndex={currentIndex}
          initialSlide={initialSlide}
        />

        <AudienceTakeaways sessionCode={session.code} />
      </div>
    </JoinGate>
  );
}
