"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { getOrCreateToken, saveEmail, type SaveEmailResult } from "@/app/live/actions";

const participantKey = (code: string) => `vc_participant_${code.toUpperCase()}`;
const tokenKey = (code: string) => `vc_token_${code.toUpperCase()}`;

export default function AudienceTakeaways({
  sessionCode,
}: {
  sessionCode: string;
}) {
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "saved" | "error">("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const pid = localStorage.getItem(participantKey(sessionCode));
    const tok = localStorage.getItem(tokenKey(sessionCode));
    setParticipantId(pid);

    if (tok) {
      setToken(tok);
      setIsReady(true);
    } else if (pid) {
      // Lazy token creation for participants who joined before this feature existed
      getOrCreateToken(pid)
        .then(({ takeawayToken }) => {
          localStorage.setItem(tokenKey(sessionCode), takeawayToken);
          setToken(takeawayToken);
        })
        .catch(() => undefined)
        .finally(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, [sessionCode]);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!participantId || !email.trim()) return;
    startTransition(async () => {
      const result: SaveEmailResult = await saveEmail(participantId, email.trim());
      if (result.error) {
        setEmailError(result.error);
        setEmailStatus("error");
      } else {
        setEmailError(null);
        setEmailStatus("saved");
      }
    });
  }

  function handleCopyLink() {
    if (!token) return;
    const url = `${window.location.origin}/takeaways/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Don't render until we've checked localStorage
  if (!isReady || !participantId) return null;

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 max-w-2xl mx-auto w-full">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">
        Your takeaways
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Saved slides, notes, and questions from this session — private to you.
      </p>

      {/* Takeaways link */}
      {token && (
        <div className="flex items-center gap-3 mb-5">
          <Link
            href={`/takeaways/${token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
          >
            View my takeaways
          </Link>
          <button
            onClick={handleCopyLink}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}

      {/* Email capture */}
      {emailStatus === "saved" ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          <p className="font-medium">Email saved.</p>
          <p className="text-xs text-gray-400 mt-1">
            Email delivery is not configured yet — your takeaways link above is always available.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-500 mb-2">
            Want an email reminder with your takeaways link?
          </p>
          <form onSubmit={handleEmailSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailStatus("idle");
                setEmailError(null);
              }}
              placeholder="your@email.com"
              maxLength={200}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              disabled={isPending || !email.trim()}
              className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {isPending ? "Saving…" : "Save email"}
            </button>
          </form>
          {emailError && (
            <p className="mt-2 text-xs text-red-600">{emailError}</p>
          )}
        </div>
      )}
    </div>
  );
}
