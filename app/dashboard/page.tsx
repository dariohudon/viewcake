import Link from "next/link";
import PresenterNav from "@/components/presenter/nav";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const presentationWhere = userId
    ? { OR: [{ userId }, { userId: null }] }
    : { userId: null };

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [presentations, sessionCount, participantCount] = await Promise.all([
    prisma.presentation.findMany({
      where: presentationWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        slideCount: true,
        createdAt: true,
      },
    }),
    prisma.liveSession.count({
      where: {
        presentation: presentationWhere,
        createdAt: { gte: monthStart },
      },
    }),
    prisma.audienceParticipant.count({
      where: { session: { presentation: presentationWhere } },
    }),
  ]);

  const totalPresentations = await prisma.presentation.count({
    where: presentationWhere,
  });

  return (
    <>
      <PresenterNav />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Your presentations and recent sessions
            </p>
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
            { label: "Presentations", value: totalPresentations },
            { label: "Sessions this month", value: sessionCount },
            { label: "Total participants", value: participantCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Recent presentations
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {presentations.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No presentations yet.{" "}
                <Link
                  href="/presentations/new"
                  className="text-gray-900 underline"
                >
                  Create your first one.
                </Link>
              </div>
            ) : (
              presentations.map((p) => (
                <Link
                  key={p.id}
                  href={`/presentations/${p.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900 flex-1 truncate">
                    {p.title}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${
                      p.status === "READY"
                        ? "bg-green-100 text-green-700"
                        : p.status === "ARCHIVED"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {p.status.toLowerCase()}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {p.slideCount} slide{p.slideCount !== 1 ? "s" : ""}
                  </span>
                </Link>
              ))
            )}
          </div>
          {totalPresentations > 5 && (
            <div className="mt-3 text-right">
              <Link
                href="/presentations"
                className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2"
              >
                View all {totalPresentations}
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
