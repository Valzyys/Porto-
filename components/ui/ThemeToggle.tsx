"use client";

import { setTheme, useTheme } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

/** Toggle tema dua ikon (matahari/bulan) dalam satu bingkai, segmen aktif gelap. */
export function ThemeToggle() {
  const theme = useTheme();
  const opts = [
    { id: "light" as const, icon: "sun" as const, label: "Tema terang" },
    { id: "dark" as const, icon: "moon" as const, label: "Tema gelap" },
  ];
  return (
    <div role="radiogroup" aria-label="Tema" className="flex h-9 items-stretch gap-0.5 border border-line p-0.5">
      {opts.map((o) => {
        const on = theme === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={o.label}
            onClick={() => setTheme(o.id)}
            className={`grid w-8 place-items-center transition-colors duration-150 ${on ? "bg-button text-on-button" : "text-mute hover:text-ink"}`}
          >
            <Icon name={o.icon} size={14} />
          </button>
        );
      })}
    </div>
  );
}
