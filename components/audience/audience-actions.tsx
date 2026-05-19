"use client";

import { useState, useEffect, useTransition } from "react";
import { saveSlide, askQuestion } from "@/app/live/actions";

const storageKey = (code: string) => `vc_participant_${code.toUpperCase()}`;

export default function AudienceActions({
  sessionId,
  sessionCode,
  slideId,
}: {
  sessionId: string;
  sessionCode: string;
  slideId: string | null;
}) {
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const [savePending, startSaveTransition] = useTransition();
  const [questionPending, startQuestionTransition] = useTransition();

  useEffect(() => {
    setParticipantId(localStorage.getItem(storageKey(sessionCode)));
  }, [sessionCode]);

  // Reset per-slide state when slide changes
  useEffect(() => {
    setSaved(false);
    setShowQuestion(false);
    setQuestionText("");
    setQuestionSent(false);
  }, [slideId]);

  function handleSave() {
    if (!participantId || !slideId || saved) return;
    startSaveTransition(async () => {
      await saveSlide(participantId, slideId, sessionId);
      setSaved(true);
    });
  }

  function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!participantId || !slideId || !questionText.trim()) return;
    startQuestionTransition(async () => {
      await askQuestion(participantId, slideId, sessionId, questionText);
      setQuestionSent(true);
      setQuestionText("");
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={savePending || saved || !slideId || !participantId}
          className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
            saved
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {saved ? "Saved" : "Save slide"}
        </button>

        <button
          onClick={() => {
            setShowQuestion((v) => !v);
            setQuestionSent(false);
          }}
          disabled={!slideId || !participantId}
          className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Ask question
        </button>
      </div>

      {showQuestion && (
        <div className="w-full max-w-md">
          {questionSent ? (
            <p className="text-sm text-center text-gray-500">
              Question sent to the presenter.
            </p>
          ) : (
            <form onSubmit={handleAsk} className="flex gap-2">
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type your question…"
                maxLength={280}
                autoFocus
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                type="submit"
                disabled={questionPending || !questionText.trim()}
                className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {questionPending ? "…" : "Send"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
