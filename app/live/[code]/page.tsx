export default async function LiveSessionPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal audience header */}
      <header className="border-b border-gray-200 px-5 h-12 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">Viewcake</span>
        <span className="text-xs font-mono text-gray-400 tracking-widest">{code}</span>
      </header>

      {/* Slide display */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-6">
          <p className="text-gray-400 text-sm">Waiting for presenter to share a slide…</p>
        </div>

        {/* Audience actions */}
        <div className="flex gap-3">
          <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
            Save slide
          </button>
          <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
            Add note
          </button>
          <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
            Ask question
          </button>
        </div>
      </div>

      {/* Notes area */}
      <div className="border-t border-gray-200 px-6 py-4 max-w-2xl mx-auto w-full">
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Your notes for this slide
        </label>
        <textarea
          rows={3}
          placeholder="Type a note…"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
    </div>
  );
}
