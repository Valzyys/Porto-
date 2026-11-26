"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { installTabs } from "@/content/pkg";
import { CopyButton } from "@/components/ui/CopyButton";
import { Icon } from "@/components/ui/Icon";

/**
 * Kotak install bergaya kotak chat referensi: perintah "diketik" huruf demi
 * huruf, chip package manager di bawah, tombol salin bundar di kanan.
 */
export function InstallBox({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);
  const cmdRef = useRef<HTMLSpanElement>(null);
  const cmd = installTabs[i].cmd;

  useGSAP(
    () => {
      const el = cmdRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = cmd;
        return;
      }
      const state = { n: 0 };
      el.textContent = "";
      const tw = gsap.to(state, {
        n: cmd.length,
        duration: Math.min(1.2, cmd.length * 0.04),
        ease: "none",
        delay: 0.15,
        onUpdate: () => {
          el.textContent = cmd.slice(0, Math.round(state.n));
        },
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
      });
      return () => tw.kill();
    },
    { dependencies: [cmd] },
  );

  return (
    <div className={`rounded-box border border-line bg-surface p-3 shadow-[0_1px_0_0_var(--c-line)] ${className}`}>
      <p className="flex min-h-14 items-start gap-2 px-2 pt-1.5 font-mono text-[15px] text-ink">
        <span className="select-none text-mute">$</span>
        <span className="min-w-0 break-all">
          <span ref={cmdRef} aria-hidden="true">
            {cmd}
          </span>
          <span className="sr-only">{cmd}</span>
          <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-blue" />
        </span>
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Package manager">
          <span className="micro mr-1 flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-mute">
            <Icon name="terminal" size={12} /> install
          </span>
          {installTabs.map((t, k) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              className={`micro rounded-full px-2.5 py-1 transition-colors duration-150 ${k === i ? "bg-button text-on-button" : "text-mute hover:text-ink"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <CopyButton value={cmd} label="Salin perintah install" round />
      </div>
    </div>
  );
}
