import Link from "next/link";
import PresenterNav from "@/components/presenter/nav";

export default function DashboardPage() {
  return (
    <>
      <PresenterNav />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Your presentations and recent sessions</p>
          </div>
          <Link
            href="/presentations/new"
            className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            New presentation
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Presentations", value: "—" },
            { label: "Sessions this month", value: "—" },
            { label: "Total participants", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Recent presentations
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              No presentations yet.{" "}
              <Link href="/presentations/new" className="text-gray-900 underline">
                Create your first one.
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
