"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { highlight } from "@/lib/highlight";
import { CopyButton } from "@/components/ui/CopyButton";

export type CodeTab = { label: string; lang: string; code: string };

/**
 * Blok kode bertab (gaya "A SHELL · COPY" referensi): label tab mono kecil,
 * sorot sintaks ringan, nomor baris, tombol salin. Ganti tab = crossfade GSAP.
 */
export function CodeBlock({ tabs, title, lineNumbers = true }: { tabs: CodeTab[]; title?: string; lineNumbers?: boolean }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLPreElement>(null);
  const tab = tabs[i];
  const lines = tab.code.split("\n");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(ref.current, { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: motion.dur.fast, ease: motion.ease.out });
    },
    { dependencies: [i] },
  );

  return (
    <div className="my-5 min-w-0 overflow-hidden border border-line bg-code">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto" role={tabs.length > 1 ? "tablist" : undefined}>
          {title && <span className="micro mr-2 shrink-0 text-mute">{title}</span>}
          {tabs.length > 1
            ? tabs.map((t, k) => (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  onClick={() => setI(k)}
                  className={`micro shrink-0 rounded-tag px-2 py-1 transition-colors duration-150 ${
                    k === i ? "bg-button text-on-button" : "text-mute hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))
            : !title && <span className="micro text-mute">{tab.label}</span>}
        </div>
        <CopyButton value={tab.code} label={`Salin kode ${tab.label}`} />
      </div>
      <pre ref={ref} className="overflow-x-auto px-4 py-3.5 text-[13px] leading-[1.7]" tabIndex={0}>
        <code className="grid">
          {lines.map((line, n) => (
            <span key={n} className="grid grid-cols-[auto_1fr] gap-4">
              {lineNumbers && lines.length > 1 ? (
                <span aria-hidden="true" className="w-5 select-none text-right tabular-nums text-px3">
                  {n + 1}
                </span>
              ) : (
                <span aria-hidden="true" />
              )}
              <span className="whitespace-pre">
                {highlight(line, tab.lang).map((tk, k) =>
                  tk.t ? (
                    <span key={k} className={`tk-${tk.t}`}>
                      {tk.v}
                    </span>
                  ) : (
                    tk.v
                  ),
                )}
                {line === "" ? " " : null}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
