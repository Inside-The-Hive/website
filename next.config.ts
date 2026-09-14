import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Build output directory.
   *
   * Overridable so a verification build can be run against a live dev server
   * without touching its cache. `next dev` holds .next open; deleting or
   * rewriting that directory underneath it leaves the running server serving
   * Internal Server Error with no way to recover but a restart.
   *
   *   NEXT_DIST_DIR=.next-verify npm run build
   *   NEXT_DIST_DIR=.next-verify npx next start -p 3100
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
