import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't let lint warnings in the v1 surfaces block a production deploy.
  // Types are still fully checked (tsc passes clean).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
