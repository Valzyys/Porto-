"use client";

import { setTheme, useTheme } from "@/lib/theme";
import { PixelIcon } from "@/components/pixel/PixelIcon";

/**
 * Tombol ganti tema terang/gelap. `floating` = versi kecil di pojok kanan atas;
 * tanpa `floating` = versi lebar untuk di dalam menu HUD.
 */
export function ThemeToggle({ floating = false }: { floating?: boolean }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? "Ganti ke tema terang" : "Ganti ke tema gelap";

  if (floating) {
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={label}
        title={label}
        data-cursor={next === "light" ? "LIGHT" : "DARK"}
        className="fixed right-[var(--s-gutter)] top-3 z-hud flex h-9 items-center gap-2 border border-line bg-ink/80 px-3 text-paper backdrop-blur-sm transition-colors duration-[var(--dur-fast)] hover:border-paper"
      >
        <PixelIcon name={theme === "dark" ? "moon" : "sun"} size={14} />
        <span className="font-mono text-[0.65rem] uppercase tracking-widest" suppressHydrationWarning>
          {theme === "dark" ? "gelap" : "terang"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      className="flex items-center gap-2 border border-line px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper hover:border-paper"
    >
      <PixelIcon name={theme === "dark" ? "moon" : "sun"} size={14} />
      <span suppressHydrationWarning>tema: {theme === "dark" ? "gelap" : "terang"}</span>
    </button>
  );
}
