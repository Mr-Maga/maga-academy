import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 no longer runs ESLint during `next build`, so no eslint config is
  // needed here. Types are fully checked at build time (tsc passes clean).
};

export default nextConfig;
