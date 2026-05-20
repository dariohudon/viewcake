import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/app/auth/actions";
import ViewcakeLogo from "@/components/brand/viewcake-logo";

export default async function PresenterNav() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
          <ViewcakeLogo size="sm" />
        </Link>
        <div className="flex items-center gap-5 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/presentations" className="hover:text-gray-900">
            Presentations
          </Link>
          {user && (
            <span className="text-gray-400 hidden sm:inline truncate max-w-32">
              {user.name ?? user.email}
            </span>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              className="hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
