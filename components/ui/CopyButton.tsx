"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

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
      className="micro flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-1 transition-colors duration-150 hover:bg-ink hover:text-canvas"
    >
      <Icon name={done ? "check" : "copy"} size={12} />
      <span aria-live="polite">{done ? "tersalin" : "salin"}</span>
    </button>
  );
}
