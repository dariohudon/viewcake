import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";
import CopyButton from "@/components/ui/copy-button";
import ImageLightbox from "@/components/ui/image-lightbox";
import ViewcakeLogo from "@/components/brand/viewcake-logo";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function TakeawaysPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const participant = await prisma.audienceParticipant.findUnique({
    where: { takeawayToken: token },
    include: {
      session: {
        include: {
          presentation: { select: { title: true } },
        },
      },
      saves: {
        include: {
          slide: {
            select: { id: true, order: true, title: true, imagePath: true },
          },
        },
        orderBy: { savedAt: "asc" },
      },
      annotations: {
        include: {
          slide: { select: { id: true, order: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!participant) notFound();

  const notes = participant.annotations.filter((a) => !a.isPublic);
  const questions = participant.annotations.filter((a) => a.isPublic);
  const savedSlideIds = new Set(participant.saves.map((s) => s.slide.id));

  // Group notes by slideId for display alongside saved slides
  const notesBySlide: Record<string, typeof notes> = {};
  for (const note of notes) {
    if (!notesBySlide[note.slideId]) notesBySlide[note.slideId] = [];
    notesBySlide[note.slideId].push(note);
  }

  // Notes on slides the participant did NOT save
  const orphanNotes = notes.filter((n) => !savedSlideIds.has(n.slideId));

  const presentationTitle = participant.session.presentation.title;
  const sessionCode = participant.session.code;

  // Best available date: session start → session created
  const sessionDate = participant.session.startedAt ?? participant.session.createdAt;
  const presentedOn = formatDate(sessionDate);

  const appUrl = (process.env.APP_URL ?? "").replace(/\/$/, "");
  const takeawaysUrl = appUrl
    ? `${appUrl}/takeaways/${token}`
    : `/takeaways/${token}`;

  const isEmpty =
    participant.saves.length === 0 &&
    notes.length === 0 &&
    questions.length === 0;

  // Plain-text export
  const exportLines = [
    `Viewcake Takeaways`,
    ``,
    `Presentation: ${presentationTitle}`,
    `Session: ${sessionCode}`,
    ...(presentedOn ? [`Date: ${presentedOn}`] : []),
    `Name: ${participant.displayName ?? "Anonymous"}`,
    ``,
    `--- Saved Slides ---`,
    ...(participant.saves.length === 0
      ? ["None"]
      : participant.saves.map(
          (s) =>
            `Slide ${s.slide.order}${s.slide.title ? ` — ${s.slide.title}` : ""}`
        )),
    ``,
    `--- Notes ---`,
    ...(notes.length === 0
      ? ["None"]
      : notes.map((n) => `[Slide ${n.slide.order}] ${n.body}`)),
    ``,
    `--- Questions Asked ---`,
    ...(questions.length === 0
      ? ["None"]
      : questions.map((q) => `[Slide ${q.slide.order}] ${q.body}`)),
    ``,
    `Takeaways link: ${takeawaysUrl}`,
  ];
  const exportText = exportLines.join("\n");

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-5 h-12 flex items-center">
        <Link href="/">
          <ViewcakeLogo size="sm" />
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your takeaways</h1>
          <p className="text-sm text-gray-500 mt-1">
            {presentationTitle}
            <span className="text-gray-400"> · Session {sessionCode}</span>
          </p>
          {presentedOn && (
            <p className="text-xs text-gray-400 mt-0.5">
              Presented on {presentedOn}
            </p>
          )}
          {participant.displayName && (
            <p className="text-xs text-gray-400 mt-0.5">
              {participant.displayName}
            </p>
          )}
        </div>

        {/* Export / copy */}
        <div className="flex flex-wrap gap-2 mb-8">
          <CopyButton text={exportText} label="Copy takeaways" />
          <CopyButton text={takeawaysUrl} label="Copy link" />
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center text-sm text-gray-400">
            You haven&apos;t saved slides or added notes yet.
          </div>
        )}

        {/* Saved slides */}
        {participant.saves.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Saved slides ({participant.saves.length})
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
              {participant.saves.map((save) => {
                const slideNotes = notesBySlide[save.slide.id] ?? [];
                const imageUrl = save.slide.imagePath
                  ? slideImageUrl(save.slide.imagePath)
                  : null;
                const slideLabel =
                  save.slide.title ?? `Slide ${save.slide.order}`;

                return (
                  <div key={save.id} className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 w-5 text-right shrink-0">
                        {save.slide.order}
                      </span>

                      {imageUrl ? (
                        <ImageLightbox
                          src={imageUrl}
                          alt={slideLabel}
                          thumbWidth="w-20"
                          thumbHeight="h-12"
                        />
                      ) : (
                        <div className="w-20 h-12 rounded bg-gray-100 shrink-0" />
                      )}

                      <p className="text-sm text-gray-700 flex-1">
                        {slideLabel}
                      </p>
                    </div>

                    {slideNotes.length > 0 && (
                      <div className="mt-2 ml-8 space-y-1">
                        {slideNotes.map((note) => (
                          <p
                            key={note.id}
                            className="text-xs text-gray-600 bg-gray-50 rounded px-3 py-1.5 border border-gray-100"
                          >
                            {note.body}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Notes on unsaved slides */}
        {orphanNotes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Notes
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
              {orphanNotes.map((note) => (
                <div key={note.id} className="px-5 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">
                    Slide {note.slide.order}
                  </p>
                  <p className="text-sm text-gray-700">{note.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Questions */}
        {questions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Questions asked ({questions.length})
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
              {questions.map((q) => (
                <div key={q.id} className="px-5 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">
                    Slide {q.slide.order}
                  </p>
                  <p className="text-sm text-gray-700">{q.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
