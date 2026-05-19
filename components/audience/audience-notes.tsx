"use client";

import { useState, useEffect, useTransition } from "react";
import { saveNote } from "@/app/live/actions";

const storageKey = (code: string) => `vc_participant_${code.toUpperCase()}`;

export default function AudienceNotes({
  sessionId,
  sessionCode,
  slideId,
}: {
  sessionId: string;
  sessionCode: string;
  slideId: string | null;
}) {
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setParticipantId(localStorage.getItem(storageKey(sessionCode)));
  }, [sessionCode]);

  // Reset when slide changes
  useEffect(() => {
    setNote("");
    setNoteSaved(false);
  }, [slideId]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!participantId || !slideId || !note.trim()) return;
    startTransition(async () => {
      await saveNote(participantId, slideId, sessionId, note);
      setNoteSaved(true);
    });
  }

  return (
    <div className="border-t border-gray-200 px-6 py-4 max-w-2xl mx-auto w-full">
      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
        Your notes for this slide
      </label>
      <form onSubmit={handleSave} className="space-y-2">
        <textarea
          rows={3}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setNoteSaved(false);
          }}
          placeholder="Type a note…"
          disabled={!slideId || !participantId}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-40"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending || !note.trim() || !slideId || !participantId}
            className="rounded-lg bg-gray-900 text-white px-4 py-1.5 text-xs font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors"
          >
            {isPending ? "Saving…" : "Save note"}
          </button>
          {noteSaved && (
            <span className="text-xs text-gray-400">Note saved.</span>
          )}
        </div>
      </form>
    </div>
  );
}
