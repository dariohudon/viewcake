"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean.length >= 4) {
      router.push(`/live/${clean}`);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join a session</h1>
        <p className="text-gray-500 text-sm mb-8">Enter the code shown by your presenter</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABCXYZ"
            maxLength={8}
            className="w-full text-center text-2xl tracking-widest font-mono rounded-xl border border-gray-300 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gray-900 uppercase"
            autoFocus
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={code.trim().length < 4}
            className="w-full rounded-lg bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Join
          </button>
        </form>
      </div>
    </main>
  );
}
