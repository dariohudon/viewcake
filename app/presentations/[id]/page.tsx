import Link from "next/link";
import PresenterNav from "@/components/presenter/nav";

export default async function PresentationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PresenterNav />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-2 text-sm text-gray-400">
          <Link href="/presentations" className="hover:text-gray-600">Presentations</Link>
          {" / "}
          <span className="text-gray-600">Untitled</span>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Presentation</h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">id: {id}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
              Edit
            </button>
            <Link
              href={`/sessions/${id}/presenter`}
              className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Start session
            </Link>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Slides</h2>
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-400">
            No slides yet. Upload a deck to get started.
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Past sessions</h2>
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-400">
            No sessions yet.
          </div>
        </section>
      </main>
    </>
  );
}
