import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    // Slide images are served from our own API route — no external domains needed
    remotePatterns: [],
    // Allow relative /api/uploads/slides/... paths (same origin, no config needed)
    // next/image works with same-origin paths by default
  },
};

export default nextConfig;
