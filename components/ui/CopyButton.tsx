"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Tombol salin kecil: ikon berganti ✓ selama 1.6 detik. */
export function CopyButton({ value, label = "Salin", className = "", round = false }: { value: string; label?: string; className?: string; round?: boolean }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard diblokir: diam saja */
        }
      }}
      className={
        round
          ? `grid h-9 w-9 place-items-center rounded-full bg-sunken text-mute transition-colors duration-150 hover:bg-button hover:text-on-button ${className}`
          : `micro flex items-center gap-1.5 rounded-tag px-2 py-1 text-mute transition-colors duration-150 hover:text-ink ${className}`
      }
    >
      <Icon name={done ? "check" : "copy"} size={round ? 15 : 13} className={done ? "text-green" : undefined} />
      {!round && <span aria-live="polite">{done ? "copied" : "copy"}</span>}
    </button>
  );
}
