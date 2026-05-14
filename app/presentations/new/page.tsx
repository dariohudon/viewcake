import Link from "next/link";
import PresenterNav from "@/components/presenter/nav";

export default function NewPresentationPage() {
  return (
    <>
      <PresenterNav />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">New presentation</h1>

        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="My Presentation"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload deck
            </label>
            <div className="rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 text-center">
              <p className="text-sm text-gray-500">PDF upload — coming soon</p>
              <p className="text-xs text-gray-400 mt-1">Drag & drop or click to select a PDF file</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-gray-900 text-white px-5 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Create presentation
            </button>
            <Link
              href="/presentations"
              className="rounded-lg border border-gray-300 bg-white text-gray-700 px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
