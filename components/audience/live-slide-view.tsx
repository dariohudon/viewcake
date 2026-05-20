"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AudienceActions from "./audience-actions";
import AudienceNotes from "./audience-notes";

export type SlideInfo = {
  id: string;
  order: number;
  title: string | null;
  imageUrl: string | null;
};

type PollResponse = {
  status: string;
  currentSlideIndex: number;
  totalSlides: number;
  slide: SlideInfo | null;
};

interface Props {
  sessionCode: string;
  sessionId: string;
  presentationTitle: string;
  totalSlides: number;
  initialIndex: number;
  initialSlide: SlideInfo | null;
  intervalMs?: number;
}

export default function LiveSlideView({
  sessionCode,
  sessionId,
  presentationTitle,
  totalSlides: initTotal,
  initialIndex,
  initialSlide,
  intervalMs = 3000,
}: Props) {
  const [live, setLive] = useState<PollResponse>({
    status: "LIVE",
    currentSlideIndex: initialIndex,
    totalSlides: initTotal,
    slide: initialSlide,
  });
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/live/${sessionCode}/state`, {
          cache: "no-store",
        });
        if (cancelled || !res.ok) return;
        const data: PollResponse = await res.json();
        if (cancelled) return;
        if (data.status === "ENDED") {
          setEnded(true);
          return;
        }
        setLive(data);
      } catch {
        // Network error — keep displaying last known state silently
      }
    }

    const id = setInterval(poll, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sessionCode, intervalMs]);

  if (ended) {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-gray-500 text-sm">This session has ended.</p>
        </div>
        <AudienceNotes
          sessionId={sessionId}
          sessionCode={sessionCode}
          slideId={null}
        />
      </>
    );
  }

  const { currentSlideIndex, totalSlides, slide } = live;

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Title + counter */}
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm font-medium text-gray-700">
            {presentationTitle}
          </p>
          {totalSlides > 0 && (
            <span className="text-xs text-gray-400 tabular-nums">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
          )}
        </div>

        {/* Slide canvas */}
        <div className="w-full max-w-2xl aspect-video bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center mb-6">
          {slide?.imageUrl ? (
            <Image
              src={slide.imageUrl}
              alt={slide.title ?? `Slide ${slide.order}`}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <p className="text-gray-400 text-sm">
              {totalSlides === 0
                ? "Waiting for presenter to share a slide…"
                : `Slide ${slide?.order ?? 1}`}
            </p>
          )}
        </div>

        {/* Save / Ask — receive the live slideId */}
        <AudienceActions
          sessionId={sessionId}
          sessionCode={sessionCode}
          slideId={slide?.id ?? null}
        />
      </div>

      {/* Notes — receive the live slideId */}
      <AudienceNotes
        sessionId={sessionId}
        sessionCode={sessionCode}
        slideId={slide?.id ?? null}
      />
    </>
  );
}
