"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, isReduced } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { installTabs } from "@/content/pkg";
import { CopyButton } from "@/components/ui/CopyButton";
import { Icon } from "@/components/ui/Icon";

/**
 * Kotak install bergaya kotak chat referensi: perintah "diketik" huruf demi
 * huruf (perintah lama dihapus mundur dulu), pil package manager meluncur ke
 * pilihan aktif, tombol salin bundar di kanan. `autoCycle` → ganti package
 * manager sendiri tiap beberapa detik sampai pengguna memilih/hover.
 */
export function InstallBox({ className = "", autoCycle = false }: { className?: string; autoCycle?: boolean }) {
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const cmdRef = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const prev = useRef<string | null>(null);
  const hovering = useRef(false);
  const cmd = installTabs[i].cmd;

  // ketik perintah: hapus mundur perintah sebelumnya lalu ketik yang baru
  useGSAP(
    () => {
      const el = cmdRef.current;
      if (!el) return;
      if (isReduced()) {
        el.textContent = cmd;
        return;
      }
      const old = prev.current;
      prev.current = cmd;
      const st = { n: old ? old.length : 0 };
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 95%", once: true } });
      if (old) {
        // pertahankan awalan yang sama (mis. "npm "), hapus sisanya
        let same = 0;
        while (same < old.length && old[same] === cmd[same]) same++;
        tl.to(st, { n: same, duration: (old.length - same) * 0.018, ease: "none", onUpdate: () => void (el.textContent = old.slice(0, Math.round(st.n))) });
        tl.to(st, { n: cmd.length, duration: (cmd.length - same) * 0.04, ease: "none", onUpdate: () => void (el.textContent = cmd.slice(0, Math.round(st.n))) });
      } else {
        el.textContent = "";
        tl.to(st, { n: cmd.length, duration: Math.min(1.2, cmd.length * 0.045), ease: "none", delay: 0.2, onUpdate: () => void (el.textContent = cmd.slice(0, Math.round(st.n))) });
      }
      return () => tl.kill();
    },
    { dependencies: [cmd] },
  );

  // pil aktif meluncur ke tombol terpilih
  useGSAP(
    () => {
      const btn = root.current?.querySelector<HTMLElement>(`[data-pm="${i}"]`);
      if (!btn || !pill.current) return;
      const to = { x: btn.offsetLeft, y: btn.offsetTop, width: btn.offsetWidth, height: btn.offsetHeight };
      if (isReduced() || !pill.current.dataset.ready) {
        gsap.set(pill.current, to);
        pill.current.dataset.ready = "1";
      } else gsap.to(pill.current, { ...to, duration: motion.dur.base, ease: "back.out(1.6)" });
    },
    { dependencies: [i], scope: root },
  );

  // ganti otomatis
  useEffect(() => {
    if (!autoCycle || manual || isReduced()) return;
    const id = window.setInterval(() => {
      if (!hovering.current && !document.hidden) setI((k) => (k + 1) % installTabs.length);
    }, 3600);
    return () => clearInterval(id);
  }, [autoCycle, manual]);

  return (
    <div
      ref={root}
      onPointerEnter={() => void (hovering.current = true)}
      onPointerLeave={() => void (hovering.current = false)}
      className={`rounded-box border border-line bg-surface p-3 shadow-[0_1px_0_0_var(--c-line)] transition-[border-color,box-shadow] duration-300 hover:border-strong/40 hover:shadow-[0_12px_32px_-18px_var(--c-ink)] ${className}`}
    >
      <p className="flex min-h-14 items-start gap-2 px-2 pt-1.5 font-mono text-[15px] text-ink">
        <span className="select-none text-mute">$</span>
        <span className="min-w-0 break-all">
          <span ref={cmdRef} aria-hidden="true">
            {cmd}
          </span>
          <span className="sr-only" aria-live="polite">
            {cmd}
          </span>
          <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-blue" />
        </span>
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="micro mr-1 flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-mute">
            <Icon name="terminal" size={12} /> install
          </span>
          <div className="relative flex items-center gap-1.5" role="tablist" aria-label="Package manager">
            <span ref={pill} aria-hidden="true" className="absolute left-0 top-0 rounded-full bg-button" />
            {installTabs.map((t, k) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                data-pm={k}
                aria-selected={k === i}
                onClick={() => {
                  setManual(true);
                  setI(k);
                }}
                className={`micro relative rounded-full px-2.5 py-1 transition-colors duration-300 ${k === i ? "text-on-button" : "text-mute hover:text-ink"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <CopyButton value={cmd} label="Salin perintah install" round />
      </div>
    </div>
  );
}
