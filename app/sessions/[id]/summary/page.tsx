import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PresenterNav from "@/components/presenter/nav";
import CopyButton from "@/components/ui/copy-button";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";

export const dynamic = "force-dynamic";

function fmt(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function duration(start: Date | null, end: Date | null): string {
  if (!start || !end) return "—";
  const ms = end.getTime() - start.getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default async function SessionSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [session, saveCounts, questions, participants] = await Promise.all([
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
    prisma.slideSave.groupBy({
      by: ["slideId"],
      where: { participant: { sessionId: id } },
      _count: { _all: true },
    }),
    prisma.slideAnnotation.findMany({
      where: { isPublic: true, participant: { sessionId: id } },
      include: {
        participant: { select: { displayName: true } },
        slide: { select: { order: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.audienceParticipant.findMany({
      where: { sessionId: id },
      orderBy: { joinedAt: "asc" },
      select: { id: true, displayName: true, joinedAt: true },
    }),
  ]);

  if (!session) notFound();

  const saveMap = Object.fromEntries(
    saveCounts.map((s) => [s.slideId, s._count._all])
  );
  const totalSaves = saveCounts.reduce((sum, s) => sum + s._count._all, 0);
  const slides = session.presentation.slides;

  // Build per-slide question counts
  const questionsBySlide: Record<string, typeof questions> = {};
  for (const q of questions) {
    const key = q.slideId;
    if (!questionsBySlide[key]) questionsBySlide[key] = [];
    questionsBySlide[key].push(q);
  }

  // Export text
  const exportLines = [
    `Viewcake Session Export`,
    ``,
    `Code: ${session.code}`,
    `Deck: ${session.presentation.title}`,
    `Status: ${session.status}`,
    `Started: ${fmt(session.startedAt)}`,
    `Ended: ${fmt(session.endedAt)}`,
    `Duration: ${duration(session.startedAt, session.endedAt)}`,
    `Participants: ${participants.length}`,
    `Total saves: ${totalSaves}`,
    `Total questions: ${questions.length}`,
    ``,
    `--- Participants ---`,
    ...participants.map(
      (p) => `${p.displayName ?? "Anonymous"}  (joined ${fmt(p.joinedAt)})`
    ),
    ``,
    `--- Questions ---`,
    ...(questions.length === 0
      ? ["No questions."]
      : questions.map(
          (q) =>
            `[Slide ${q.slide?.order ?? "?"}] ${q.participant?.displayName ?? "Anonymous"}: ${q.body}`
        )),
  ];
  const exportText = exportLines.join("\n");

  return (
    <>
      <PresenterNav />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-2 text-sm text-gray-400">
          <Link href="/presentations" className="hover:text-gray-600">
            Presentations
          </Link>
          {" / "}
          <Link
            href={`/presentations/${session.presentation.id}`}
            className="hover:text-gray-600"
          >
            {session.presentation.title}
          </Link>
          {" / "}
          <span className="text-gray-600">Session {session.code}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Session summary
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {session.presentation.title}
            </p>
          </div>
          <CopyButton text={exportText} label="Export as text" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Participants", value: participants.length },
            { label: "Saves", value: totalSaves },
            { label: "Questions", value: questions.length },
            {
              label: "Duration",
              value: duration(session.startedAt, session.endedAt),
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {s.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Session meta */}
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 mb-8 flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              Code
            </p>
            <p className="font-mono font-medium">{session.code}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              Status
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                session.status === "LIVE"
                  ? "bg-green-100 text-green-700"
                  : session.status === "ENDED"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {session.status.toLowerCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              Started
            </p>
            <p>{fmt(session.startedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              Ended
            </p>
            <p>{fmt(session.endedAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Slide breakdown */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Slide engagement
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
              {slides.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  No slides.
                </div>
              ) : (
                slides.map((slide) => {
                  const saves = saveMap[slide.id] ?? 0;
                  const qs = questionsBySlide[slide.id] ?? [];
                  return (
                    <div
                      key={slide.id}
                      className="flex items-center gap-4 px-5 py-3"
                    >
                      <span className="text-xs font-mono text-gray-400 w-5 shrink-0 text-right">
                        {slide.order}
                      </span>
                      {slide.imagePath ? (
                        <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 relative shrink-0">
                          <Image
                            src={slideImageUrl(slide.imagePath)}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded bg-gray-100 shrink-0" />
                      )}
                      <p className="text-sm text-gray-700 flex-1 truncate">
                        {slide.title ?? `Slide ${slide.order}`}
                      </p>
                      <div className="flex items-center gap-3 shrink-0 text-xs text-gray-500">
                        {saves > 0 && (
                          <span className="text-gray-700 font-medium">
                            {saves} save{saves !== 1 ? "s" : ""}
                          </span>
                        )}
                        {qs.length > 0 && (
                          <span className="text-gray-700 font-medium">
                            {qs.length} Q{qs.length !== 1 ? "s" : ""}
                          </span>
                        )}
                        {saves === 0 && qs.length === 0 && (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Participants + Questions */}
          <div className="space-y-6">
            {/* Participants */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Participants ({participants.length})
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {participants.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    None.
                  </div>
                ) : (
                  participants.map((p) => (
                    <div key={p.id} className="px-4 py-2.5 text-sm text-gray-700">
                      {p.displayName ?? "Anonymous"}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Questions */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Questions ({questions.length})
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {questions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    No questions.
                  </div>
                ) : (
                  questions.map((q) => (
                    <div key={q.id} className="px-4 py-3">
                      <p className="text-sm text-gray-800">{q.body}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {q.participant?.displayName ?? "Anonymous"}
                        {q.slide && (
                          <span className="ml-1.5">· slide {q.slide.order}</span>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
