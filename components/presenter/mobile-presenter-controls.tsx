"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { advanceSlide, goToSlide } from "@/app/sessions/actions";

type Slide = {
  id: string;
  order: number;
  title: string | null;
  imageUrl: string | null;
};

type Question = {
  id: string;
  body: string;
  participant: { displayName: string | null } | null;
  slide: { order: number } | null;
};

interface Props {
  sessionId: string;
  currentIndex: number;
  slides: Slide[];
  questions: Question[];
}

export default function MobilePresenterControls({
  sessionId,
  currentIndex,
  slides,
  questions,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showQuestions, setShowQuestions] = useState(false);

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= slides.length - 1;

  function advance(direction: "prev" | "next") {
    startTransition(async () => {
      await advanceSlide(sessionId, direction);
      router.refresh();
    });
  }

  function jumpTo(index: number) {
    if (index === currentIndex) return;
    startTransition(async () => {
      await goToSlide(sessionId, index);
      router.refresh();
    });
  }

  return (
    <div className="lg:hidden shrink-0 flex flex-col gap-4 px-3 pb-6 pt-2 bg-gray-950">

      {/* Prev / Next — large tap targets */}
      <div className="flex items-center gap-3">
        <button
          disabled={isFirst || pending}
          onClick={() => advance("prev")}
          className="flex-1 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-xl py-4 text-base font-semibold transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap px-1 text-center leading-tight">
          {slides.length > 0 ? (
            <>
              <span className="block text-white font-semibold text-sm">
                {currentIndex + 1}
              </span>
              <span className="text-gray-600">/{slides.length}</span>
            </>
          ) : (
            "—"
          )}
        </span>

        <button
          disabled={isLast || pending}
          onClick={() => advance("next")}
          className="flex-1 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-xl py-4 text-base font-semibold transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Horizontal thumbnail strip */}
      {slides.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => jumpTo(i)}
              disabled={pending}
              className={`relative shrink-0 w-24 h-[54px] rounded-lg overflow-hidden bg-gray-800 transition-all ${
                i === currentIndex
                  ? "ring-2 ring-teal-400 ring-offset-1 ring-offset-gray-950"
                  : "opacity-50 hover:opacity-75"
              } disabled:cursor-not-allowed`}
              aria-label={`Go to slide ${slide.order}`}
            >
              {slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt={slide.title ?? `Slide ${slide.order}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-xs font-mono text-gray-500">
                    {slide.order}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Questions toggle */}
      {questions.length > 0 && (
        <div>
          <button
            onClick={() => setShowQuestions((v) => !v)}
            className="w-full flex items-center justify-between text-xs text-gray-400 uppercase tracking-wide py-2 border-t border-gray-800"
          >
            <span>
              Questions
              <span className="ml-2 bg-gray-700 rounded-full px-1.5 py-0.5 text-white tabular-nums">
                {questions.length}
              </span>
            </span>
            <span className="text-gray-600">{showQuestions ? "▲" : "▼"}</span>
          </button>

          {showQuestions && (
            <div className="space-y-2 mt-2">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="rounded-lg bg-gray-800 px-3 py-2.5 text-sm"
                >
                  <p className="text-white leading-snug">{q.body}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {q.participant?.displayName ?? "Anonymous"}
                    {q.slide && (
                      <span className="ml-2 text-gray-600">
                        · slide {q.slide.order}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
