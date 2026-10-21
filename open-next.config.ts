import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Semua halaman di-prerender saat build (SSG), jadi cache cukup dibaca
// dari Workers Static Assets. Tidak perlu R2/KV, tidak ada binding berbayar.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
