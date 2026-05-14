import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
          Viewcake
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          Real-time presentation amplification.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-5 py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Presenter login
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-900 px-5 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Join a session
          </Link>
        </div>
      </div>
    </main>
  );
}
