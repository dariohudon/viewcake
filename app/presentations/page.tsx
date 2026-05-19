import Link from "next/link";
import PresenterNav from "@/components/presenter/nav";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  if (status === "READY") return "bg-green-100 text-green-700";
  if (status === "ARCHIVED") return "bg-gray-100 text-gray-500";
  return "bg-yellow-50 text-yellow-700";
}

export default async function PresentationsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Show the user's own presentations plus any orphaned (null userId) legacy records
  const presentations = await prisma.presentation.findMany({
    where: userId
      ? { OR: [{ userId }, { userId: null }] }
      : { userId: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      slideCount: true,
      originalFilename: true,
      createdAt: true,
    },
  });

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
          {presentations.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">
              No presentations yet.{" "}
              <Link
                href="/presentations/new"
                className="text-gray-900 underline underline-offset-2"
              >
                Create your first one.
              </Link>
            </div>
          ) : (
            presentations.map((p) => (
              <Link
                key={p.id}
                href={`/presentations/${p.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {p.title}
                  </p>
                  {p.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {p.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-300 mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-6">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(p.status)}`}
                  >
                    {p.status.toLowerCase()}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {p.slideCount} slide{p.slideCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </>
  );
}
