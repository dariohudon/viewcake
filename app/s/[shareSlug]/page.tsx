import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slideImageUrl } from "@/lib/pdf/slide-image-url";
import ViewcakeLogo from "@/components/brand/viewcake-logo";

export const dynamic = "force-dynamic";

export default async function SlideSharePage({
  params,
}: {
  params: Promise<{ shareSlug: string }>;
}) {
  const { shareSlug } = await params;

  const share = await prisma.slideShare.findUnique({
    where: { shareSlug },
    include: {
      slide: {
        include: {
          presentation: { select: { title: true } },
        },
      },
    },
  });

  if (!share) notFound();

  // Respect expiry if set
  if (share.expiresAt && share.expiresAt < new Date()) notFound();

  const { slide } = share;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Presentation title */}
        <p className="text-sm font-medium text-gray-500 mb-3 text-center">
          {slide.presentation.title}
          {slide.title && (
            <span className="text-gray-400"> · {slide.title}</span>
          )}
        </p>

        {/* Slide image */}
        <div className="aspect-video bg-white rounded-xl border border-gray-200 overflow-hidden relative flex items-center justify-center mb-6 shadow-sm">
          {slide.imagePath ? (
            <Image
              src={slideImageUrl(slide.imagePath)}
              alt={slide.title ?? `Slide ${slide.order}`}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <p className="text-gray-400 text-sm">Slide {slide.order}</p>
          )}
        </div>

        {/* Slide number */}
        <p className="text-center text-xs text-gray-400 mb-4">
          Slide {slide.order}
        </p>

        {/* Footer */}
        <div className="flex justify-center">
          <Link href="/" className="opacity-50 hover:opacity-80 transition-opacity">
            <ViewcakeLogo size="sm" className="text-gray-500" />
          </Link>
        </div>
      </div>
    </main>
  );
}
