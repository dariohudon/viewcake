export default async function SlideSharePage({
  params,
}: {
  params: Promise<{ shareSlug: string }>;
}) {
  const { shareSlug } = await params;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="aspect-video bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-6">
          <p className="text-gray-400 text-sm">Shared slide — {shareSlug}</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">Shared via Viewcake</p>
        </div>
      </div>
    </main>
  );
}
