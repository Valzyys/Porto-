"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { installTabs } from "@/content/pkg";
import { CopyButton } from "@/components/ui/CopyButton";

/** Bilah install satu baris (gaya "LINUX · MACOS · WINDOWS | $ curl … | COPY"). */
export function InstallBar() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const cmd = installTabs[i].cmd;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(ref.current, { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: motion.dur.fast, ease: motion.ease.out });
    },
    { dependencies: [i] },
  );

  return (
    <div className="flex flex-col gap-2 border border-line bg-surface p-1.5 sm:flex-row sm:items-center">
      <div className="flex shrink-0 gap-1" role="tablist" aria-label="Package manager">
        {installTabs.map((t, k) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`micro px-2.5 py-1.5 transition-colors duration-150 ${k === i ? "bg-button text-on-button" : "text-mute hover:text-ink"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <code ref={ref} className="min-w-0 flex-1 truncate px-2 font-mono text-[13px] text-ink">
        <span className="text-mute">$ </span>
        {cmd}
      </code>
      <CopyButton value={cmd} label="Salin perintah install" className="self-end border border-line sm:self-auto" />
    </div>
  );
}
