import Link from "next/link";
import PresenterNav from "@/components/presenter/nav";

export default function PresentationsPage() {
  return (
    <>
      <PresenterNav />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Presentations</h1>
          <Link
            href="/presentations/new"
            className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            New presentation
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            No presentations yet.
          </div>
        </div>
      </main>
    </>
  );
}
