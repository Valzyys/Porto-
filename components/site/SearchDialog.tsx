"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { searchStore, useSearchOpen } from "@/lib/stores";
import { docs, docHref } from "@/content/docs";
import { modules, callOf, anchorOf } from "@/content/api";
import { usePageTransition } from "@/components/transition/TransitionProvider";
import { Icon } from "@/components/ui/Icon";

type Hit = { href: string; title: string; sub: string; kind: "Page" | "Method" };

const INDEX: Hit[] = [
  { href: "/", title: "Home", sub: "Landing", kind: "Page" },
  { href: "/client", title: "Client", sub: "Tur JKT48Client", kind: "Page" },
  { href: "/modules", title: "Modules", sub: "Semua method per modul", kind: "Page" },
  { href: "/access", title: "Access", sub: "API key, priority token, admin", kind: "Page" },
  ...docs.map<Hit>((d) => ({ href: docHref(d), title: d.title, sub: `${d.section} — ${d.description}`, kind: "Page" })),
  ...modules.flatMap((m) =>
    m.methods.map<Hit>((x) => ({
      href: `/docs/api/${m.id}#${anchorOf(x)}`,
      title: `${callOf(m, x)}()`,
      sub: `${x.verb === "GET" && x.path === "—" ? "lokal" : `${x.verb} ${x.path}`} — ${x.description}`,
      kind: "Method",
    })),
  ),
];

/** Pencarian cepat (⌘K / Ctrl+K / "/"): halaman docs + semua method. */
export function SearchDialog() {
  const open = useSearchOpen();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const { navigate } = usePageTransition();

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return INDEX.slice(0, 12);
    return INDEX.filter((h) => `${h.title} ${h.sub}`.toLowerCase().includes(s)).slice(0, 30);
  }, [q]);

  // shortcut global
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input,textarea,[contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        searchStore.set(true);
      }
      if (e.key === "Escape") searchStore.set(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (open) {
        gsap.set(el, { display: "flex" });
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: motion.dur.fast });
        gsap.fromTo("[data-panel]", { y: -12, scale: 0.98 }, { y: 0, scale: 1, duration: motion.dur.base, ease: motion.ease.out });
        requestAnimationFrame(() => input.current?.focus());
      } else {
        gsap.to(el, { autoAlpha: 0, duration: motion.dur.fast, onComplete: () => void gsap.set(el, { display: "none" }) });
      }
    },
    { dependencies: [open], scope: ref },
  );

  const go = (h: Hit) => {
    searchStore.set(false);
    setQ("");
    setSel(0);
    navigate(h.href);
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian"
      className="fixed inset-0 z-dialog items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-sm"
      style={{ display: "none" }}
      onMouseDown={(e) => e.target === e.currentTarget && searchStore.set(false)}
    >
      <div data-panel className="w-full max-w-xl overflow-hidden border border-line bg-canvas shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" size={16} className="text-mute" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(hits.length - 1, s + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              } else if (e.key === "Enter" && hits[sel]) {
                go(hits[sel]);
              }
            }}
            placeholder="Cari halaman atau method, mis. getLive"
            aria-label="Kata kunci"
            className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-mute"
          />
          <kbd className="micro rounded-tag border border-line px-1.5 text-mute">esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox" aria-label="Hasil" data-lenis-prevent>
          {hits.length === 0 && <li className="px-3 py-6 text-center text-sm text-mute">Tidak ada hasil untuk “{q}”.</li>}
          {hits.map((h, i) => (
            <li key={h.href + h.title} role="option" aria-selected={i === sel}>
              <button
                type="button"
                onMouseEnter={() => setSel(i)}
                onClick={() => go(h)}
                className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors duration-100 ${i === sel ? "bg-sunken" : ""}`}
              >
                <Icon name={h.kind === "Method" ? "code" : "book"} size={15} className="mt-0.5 shrink-0 text-mute" />
                <span className="min-w-0">
                  <span className={`block truncate text-sm ${h.kind === "Method" ? "font-mono" : "font-medium"}`}>{h.title}</span>
                  <span className="block truncate text-xs text-mute">{h.sub}</span>
                </span>
                <span className="micro ml-auto shrink-0 text-px3">{h.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
