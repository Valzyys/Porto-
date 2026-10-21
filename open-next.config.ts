import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Semua halaman di-prerender saat build (SSG), jadi cache cukup dibaca
// dari Workers Static Assets. Tidak perlu R2/KV, tidak ada binding berbayar.
const config = {
  ...defineCloudflareConfig({
    incrementalCache: staticAssetsIncrementalCache,
    enableCacheInterception: true,
  }),
  // `npm run build` = build OpenNext (dipakai Workers Builds). OpenNext sendiri
  // menjalankan `next build` lewat script terpisah supaya tidak berulang.
  buildCommand: "npm run build:next",
};

export default config;
