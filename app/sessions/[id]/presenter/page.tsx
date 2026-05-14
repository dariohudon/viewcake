export default async function PresenterSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Session header bar */}
      <header className="border-b border-gray-800 px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Viewcake</span>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Join code</p>
            <p className="text-lg font-bold tracking-widest text-white font-mono">——</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Participants</p>
            <p className="text-lg font-bold text-white">0</p>
          </div>
          <button className="rounded-lg bg-red-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-red-700 transition-colors">
            End session
          </button>
        </div>
      </header>

      {/* Main presenter view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
            <p className="text-gray-500 text-sm">Slide preview — session {id}</p>
          </div>
        </div>

        {/* Right panel */}
        <aside className="w-72 border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Slides</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-gray-500 text-center mt-8">No slides loaded</p>
          </div>
          <div className="p-4 border-t border-gray-800 flex gap-2 justify-between">
            <button className="flex-1 rounded-lg bg-gray-800 text-white py-2 text-sm hover:bg-gray-700 transition-colors">
              ← Prev
            </button>
            <button className="flex-1 rounded-lg bg-gray-800 text-white py-2 text-sm hover:bg-gray-700 transition-colors">
              Next →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
