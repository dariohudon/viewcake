"use client";

import { useState } from "react";
import Image from "next/image";
import { SlideNavBar, SidebarSlideItem } from "./slide-controls";

type Slide = {
  id: string;
  order: number;
  title: string | null;
  imageUrl: string | null; // pre-resolved URL string from the server page
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

export default function PresenterSidebar({
  sessionId,
  currentIndex,
  slides,
  questions,
}: Props) {
  const [tab, setTab] = useState<"slides" | "questions">("slides");

  return (
    <aside className="w-72 border-l border-gray-800 flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-gray-800 shrink-0">
        <button
          onClick={() => setTab("slides")}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === "slides"
              ? "text-white border-b-2 border-white"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Slides
        </button>
        <button
          onClick={() => setTab("questions")}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === "questions"
              ? "text-white border-b-2 border-white"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Questions
          {questions.length > 0 && (
            <span className="ml-1.5 rounded-full bg-gray-700 px-1.5 py-0.5 text-xs tabular-nums">
              {questions.length}
            </span>
          )}
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "slides" ? (
          <div className="p-4">
            {slides.length === 0 ? (
              <p className="text-xs text-gray-500 text-center mt-8">
                No slides loaded
              </p>
            ) : (
              slides.map((slide, i) => (
                <SidebarSlideItem
                  key={slide.id}
                  sessionId={sessionId}
                  slideIndex={i}
                  currentIndex={currentIndex}
                  order={slide.order}
                  label={slide.title ?? `Slide ${slide.order}`}
                  thumbnail={
                    slide.imageUrl ? (
                      <div className="w-10 h-7 rounded overflow-hidden bg-gray-700 relative shrink-0">
                        <Image
                          src={slide.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-7 rounded bg-gray-700 shrink-0" />
                    )
                  }
                />
              ))
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {questions.length === 0 ? (
              <p className="text-xs text-gray-500 text-center mt-8">
                No questions yet
              </p>
            ) : (
              questions.map((q) => (
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
              ))
            )}
          </div>
        )}
      </div>

      <SlideNavBar
        sessionId={sessionId}
        currentIndex={currentIndex}
        slideCount={slides.length}
      />
    </aside>
  );
}
