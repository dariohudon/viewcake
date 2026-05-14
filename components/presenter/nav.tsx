import Link from "next/link";

export default function PresenterNav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold text-gray-900">
          Viewcake
        </Link>
        <div className="flex items-center gap-5 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
          <Link href="/presentations" className="hover:text-gray-900">Presentations</Link>
          <Link href="/login" className="hover:text-gray-900">Sign out</Link>
        </div>
      </div>
    </nav>
  );
}
