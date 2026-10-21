import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Situs ini sepenuhnya statis (SSG). cacheComponents sengaja dimatikan:
// fitur itu butuh runtime Node.js penuh, sedangkan target deploy-nya
// Cloudflare Workers lewat @opennextjs/cloudflare.
const nextConfig: NextConfig = {
  images: {
    // Image optimization bawaan Next tidak jalan di Workers.
    unoptimized: true,
  },
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
