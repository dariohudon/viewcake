"use client";

import { useState, useEffect, useTransition } from "react";
import { joinSession, updateLastSeen } from "@/app/live/actions";

type Status = "loading" | "prompt" | "joined";

const storageKey = (code: string) => `vc_participant_${code.toUpperCase()}`;

export default function JoinGate({
  sessionId,
  sessionCode,
  children,
}: {
  sessionId: string;
  sessionCode: string;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(sessionCode));
    if (stored) {
      // Returning participant — update heartbeat silently, proceed immediately
      setStatus("joined");
      updateLastSeen(stored).catch(() => undefined);
    } else {
      setStatus("prompt");
    }
  }, [sessionCode]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a name.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const { participantId } = await joinSession(sessionId, trimmed);
      localStorage.setItem(storageKey(sessionCode), participantId);
      setStatus("joined");
    });
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  if (status === "prompt") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Join session</h1>
          <p className="text-sm text-gray-500 mb-8">
            What should we call you during this session?
          </p>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={60}
              autoFocus
              autoComplete="nickname"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full rounded-lg bg-gray-900 text-white py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Joining…" : "Join"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // status === "joined"
  return <>{children}</>;
}
