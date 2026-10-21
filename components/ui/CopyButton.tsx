"use client";

import { useRef, useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export function CopyButton({ value, label }: { value: string; label: string }) {
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
      className="flex items-center gap-2 bg-stage px-3 py-2 font-mono text-[0.65rem] uppercase tracking-widest hover:bg-ink hover:text-lemon"
      data-cursor="COPY"
    >
      <PixelIcon name="copy" size={12} />
      <span aria-live="polite">{done ? "tersalin" : "salin"}</span>
    </button>
  );
}
