import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PresenterNav from "@/components/presenter/nav";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { startSession, createSlideShare } from "@/app/presentations/actions";

export const dynamic = "force-dynamic";

export default async function PresentationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const [presentation, sessions] = await Promise.all([
    prisma.presentation.findUnique({
      where: { id },
      include: { slides: { orderBy: { order: "asc" } } },
    }),
    prisma.liveSession.findMany({
      where: { presentationId: id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { participants: true } } },
    }),
  ]);

  if (!presentation) notFound();

  // Presentations with a userId must belong to the current user
  if (presentation.userId !== null && presentation.userId !== userId) {
    notFound();
  }

  const createdAt = new Date(presentation.createdAt).toLocaleDateString(
    "en-CA",
    { year: "numeric", month: "long", day: "numeric" }
  );

  function fmtDate(d: Date) {
    return d.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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
          <span className="text-gray-600">{presentation.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {presentation.title}
            </h1>
            {presentation.description && (
              <p className="text-sm text-gray-500 mt-1">
                {presentation.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">Created {createdAt}</p>
          </div>
          <div className="shrink-0 ml-6">
            <form action={startSession}>
              <input type="hidden" name="presentationId" value={presentation.id} />
              <button
                type="submit"
                disabled={presentation.status !== "READY"}
                className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Start session
              </button>
            </form>
            {presentation.status !== "READY" && (
              <p className="mt-1 text-xs text-gray-400 text-right">
                Upload a deck first
              </p>
            )}
          </div>
        </div>

        {/* File metadata */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white px-5 py-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Deck file
          </h2>
          {presentation.deckPath ? (
            <div className="flex items-center gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">
                  {presentation.originalFilename ?? "Uploaded file"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {presentation.slideCount} slide
                  {presentation.slideCount !== 1 ? "s" : ""}
                </p>
              </div>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
                  presentation.status === "READY"
                    ? "bg-green-100 text-green-700"
                    : presentation.status === "ARCHIVED"
                    ? "bg-gray-100 text-gray-500"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {presentation.status.toLowerCase()}
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No file uploaded.</p>
          )}
        </section>

        {/* Slides */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Slides{" "}
            <span className="text-gray-400 font-normal normal-case">
              ({presentation.slides.length})
            </span>
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {presentation.slides.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No slides extracted yet.
              </div>
            ) : (
              presentation.slides.map((slide) => (
                <div
                  key={slide.id}
                  className="flex items-center gap-4 px-5 py-3"
                >
                  <span className="text-xs font-mono text-gray-400 w-6 text-right shrink-0">
                    {slide.order}
                  </span>
                  {slide.imagePath ? (
                    <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 shrink-0 relative">
                      <Image
                        src={`/api/${slide.imagePath}`}
                        alt={`Slide ${slide.order}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-10 rounded bg-gray-100 shrink-0" />
                  )}
                  <p className="text-sm text-gray-600 flex-1">
                    {slide.title ?? `Slide ${slide.order}`}
                  </p>
                  {/* Share button — only for slides with images */}
                  {slide.imagePath && (
                    <form action={createSlideShare} className="shrink-0">
                      <input type="hidden" name="slideId" value={slide.id} />
                      <button
                        type="submit"
                        className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        Share
                      </button>
                    </form>
                  )}
                </div>
              ))
            )}
          </div>
          {presentation.slides.some((s) => !s.imagePath) && (
            <p className="mt-2 text-xs text-gray-400">
              Slides without images had rendering failures on upload.
            </p>
          )}
        </section>

        {/* Sessions */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Sessions
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {sessions.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No sessions yet. Start one above.
              </div>
            ) : (
              sessions.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3">
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {s.code}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.status === "LIVE"
                        ? "bg-green-100 text-green-700"
                        : s.status === "ENDED"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {s.status.toLowerCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {s.startedAt ? fmtDate(s.startedAt) : fmtDate(s.createdAt)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {s._count.participants} participant
                    {s._count.participants !== 1 ? "s" : ""}
                  </span>
                  <div className="ml-auto flex gap-2 shrink-0">
                    {s.status !== "ENDED" && (
                      <Link
                        href={`/sessions/${s.id}/presenter`}
                        className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        {s.status === "LIVE" ? "Rejoin" : "Open"}
                      </Link>
                    )}
                    <Link
                      href={`/sessions/${s.id}/summary`}
                      className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      Summary
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}
