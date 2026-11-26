"use client";

import { setTheme, useTheme } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

/**
 * Toggle tema tersegmen ala referensi: wadah gelap, dua tombol (bulan/matahari),
 * segmen aktif terangkat. Dua tombol nyata (radio group) supaya aksesibel.
 */
export function ThemeToggle() {
  const theme = useTheme();
  const options = [
    { id: "dark" as const, icon: "moon" as const, label: "Tema gelap", tint: "text-blue-ink" },
    { id: "light" as const, icon: "sun" as const, label: "Tema terang", tint: "text-orange" },
  ];

  return (
    <div role="radiogroup" aria-label="Tema" className="flex h-10 items-stretch gap-1 rounded-inner bg-bar p-1">
      {options.map((o) => {
        const active = theme === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            onClick={() => setTheme(o.id)}
            className={`grid w-12 place-items-center rounded-xs transition-colors duration-150 ${
              active ? "border border-line bg-surface shadow-sm" : "hover:bg-on-bar/10"
            }`}
          >
            <Icon name={o.icon} size={18} className={o.tint} />
          </button>
        );
      })}
    </div>
  );
}
