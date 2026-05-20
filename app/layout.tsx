import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const APP_URL = "https://viewcake.brightening.ca";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "Viewcake — Live Presentations With Audience Takeaways",
  description:
    "Upload a deck, share a live code, and let your audience save slides, add notes, ask questions, and leave with private takeaways.",
  keywords: [
    "live presentations",
    "audience engagement",
    "presentation takeaways",
    "save slides",
    "speaker tools",
    "presentation notes",
  ],
  icons: {
    icon: "/viewcake-logo.png",
    shortcut: "/favicon-32.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Viewcake",
    url: APP_URL,
    title: "Viewcake — Live Presentations With Audience Takeaways",
    description:
      "Upload a deck, share a live code, and let your audience save slides, add notes, ask questions, and leave with private takeaways.",
    images: [
      {
        url: "/viewcake-og-image.png",
        width: 1672,
        height: 941,
        alt: "Viewcake — live presentation amplification",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viewcake — Live Presentations With Audience Takeaways",
    description:
      "Upload a deck, share a live code, and let your audience save slides, add notes, ask questions, and leave with private takeaways.",
    images: ["/viewcake-og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
