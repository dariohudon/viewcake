"use client";

import { useTransition } from "react";
import { advanceSlide, goToSlide } from "@/app/sessions/actions";

interface Props {
  sessionId: string;
  currentIndex: number;
  slideCount: number;
}

export default function SlideControls({ sessionId, currentIndex, slideCount }: Props) {
  const [pending, startTransition] = useTransition();

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= slideCount - 1;

  function handlePrev() {
    startTransition(() => advanceSlide(sessionId, "prev"));
  }

  function handleNext() {
    startTransition(() => advanceSlide(sessionId, "next"));
  }

  function handleGoTo(index: number) {
    startTransition(() => goToSlide(sessionId, index));
  }

  return { handlePrev, handleNext, handleGoTo, pending, isFirst, isLast };
}

// Separate export for the bottom Prev/Next bar
export function SlideNavBar({ sessionId, currentIndex, slideCount }: Props) {
  const [pending, startTransition] = useTransition();

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= slideCount - 1;

  return (
    <div className="p-4 border-t border-gray-800 flex items-center gap-2">
      <button
        disabled={isFirst || pending}
        onClick={() => startTransition(() => advanceSlide(sessionId, "prev"))}
        className="flex-1 rounded-lg bg-gray-800 text-white py-2 text-sm hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>
      <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">
        {slideCount > 0 ? `${currentIndex + 1} / ${slideCount}` : "—"}
      </span>
      <button
        disabled={isLast || pending}
        onClick={() => startTransition(() => advanceSlide(sessionId, "next"))}
        className="flex-1 rounded-lg bg-gray-800 text-white py-2 text-sm hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}

// Sidebar slide item — clickable
export function SidebarSlideItem({
  sessionId,
  slideIndex,
  currentIndex,
  label,
  thumbnail,
  order,
}: {
  sessionId: string;
  slideIndex: number;
  currentIndex: number;
  label: string;
  thumbnail: React.ReactNode;
  order: number;
}) {
  const [pending, startTransition] = useTransition();
  const isActive = slideIndex === currentIndex;

  return (
    <button
      onClick={() => startTransition(() => goToSlide(sessionId, slideIndex))}
      disabled={pending}
      className={`w-full flex items-center gap-2 py-1.5 border-b border-gray-800 last:border-0 text-left transition-colors ${
        isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
      } disabled:opacity-50`}
    >
      <span className="text-xs font-mono w-5 shrink-0">{order}</span>
      {thumbnail}
      <span className="text-xs truncate">{label}</span>
    </button>
  );
}
