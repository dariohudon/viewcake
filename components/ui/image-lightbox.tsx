"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  /** Tailwind width class for the thumbnail, e.g. "w-20" */
  thumbWidth?: string;
  /** Tailwind height class for the thumbnail, e.g. "h-12" */
  thumbHeight?: string;
}

export default function ImageLightbox({
  src,
  alt,
  thumbWidth = "w-20",
  thumbHeight = "h-12",
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Thumbnail — acts as the trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${alt} full size`}
        className={`relative shrink-0 ${thumbWidth} ${thumbHeight} rounded overflow-hidden bg-gray-100 cursor-zoom-in hover:ring-2 hover:ring-gray-400 transition-all`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="80px"
        />
      </button>

      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          {/* Stop click propagation so clicking the image itself doesn't close */}
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-9 right-0 text-white/80 hover:text-white text-sm transition-colors flex items-center gap-1.5"
              aria-label="Close"
            >
              <span>Close</span>
              <span aria-hidden="true">✕</span>
            </button>
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-900">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
