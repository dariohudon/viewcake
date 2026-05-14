import Link from "next/link";
import { notFound } from "next/navigation";
import PresenterNav from "@/components/presenter/nav";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatBytes(path: string | null): string | null {
  // We don't store file size yet — future enhancement
  return path ? path.split("/").pop() ?? null : null;
}

export default async function PresentationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const presentation = await prisma.presentation.findUnique({
    where: { id },
    include: {
      slides: { orderBy: { order: "asc" } },
    },
  });

  if (!presentation) notFound();

  const createdAt = new Date(presentation.createdAt).toLocaleDateString(
    "en-CA",
    { year: "numeric", month: "long", day: "numeric" }
  );

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
          <div className="flex gap-2 shrink-0 ml-6">
            <Link
              href={`/sessions/${id}/presenter`}
              className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Start session
            </Link>
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
                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                  {formatBytes(presentation.deckPath)}
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
                  <div className="w-12 h-8 rounded bg-gray-100 shrink-0" />
                  <p className="text-sm text-gray-600">
                    {slide.title ?? `Slide ${slide.order}`}
                  </p>
                  {!slide.imagePath && (
                    <span className="ml-auto text-xs text-gray-300">
                      placeholder
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            PDF-to-image extraction is not yet implemented. Each uploaded deck
            creates one placeholder slide record.
          </p>
        </section>

        {/* Sessions */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Past sessions
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-400">
            Live sessions not yet implemented.
          </div>
        </section>
      </main>
    </>
  );
}
