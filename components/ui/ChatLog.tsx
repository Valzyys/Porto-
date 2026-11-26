"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";

export type ChatItem = {
  from: "visitor" | "valzyy" | "system";
  /** isi bubble; boleh berisi link/elemen */
  content: React.ReactNode;
  key: string;
};

function Avatar({ who }: { who: "visitor" | "valzyy" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-pill border border-line text-[0.625rem] font-extrabold ${
        who === "valzyy" ? "bg-peach text-ink" : "halftone bg-surface text-ink [--dot-c:var(--c-hair)]"
      }`}
    >
      {who === "valzyy" ? "VZ" : "?"}
    </span>
  );
}

/**
 * Log chat bergaya UI game: bubble biru (pengunjung, kanan) dan abu gelap
 * (Valzyy, kiri) dengan avatar monogram. Bubble muncul berurutan saat masuk
 * viewport, diakhiri indikator mengetik.
 */
export function ChatLog({ items, label, typing = true }: { items: ChatItem[]; label: string; typing?: boolean }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-msg]", ref.current);
        gsap.from(rows, {
          autoAlpha: 0,
          y: 10,
          scale: 0.92,
          transformOrigin: (_i: number, el: HTMLElement) => (el.dataset.msg === "visitor" ? "100% 50%" : "0% 50%"),
          duration: motion.dur.base,
          ease: motion.ease.back,
          stagger: 0.28,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} aria-label={label} className="flex flex-col gap-2">
      {items.map((m) => {
        if (m.from === "system") {
          return (
            <li key={m.key} data-msg="system" className="pt-3 text-center text-[0.6875rem] font-semibold text-mute/80">
              {m.content}
            </li>
          );
        }
        const mine = m.from === "visitor";
        return (
          <li key={m.key} data-msg={m.from} className={`flex items-center gap-2 ${mine ? "justify-end" : "justify-start"}`}>
            {!mine && <Avatar who="valzyy" />}
            <span
              className={`min-w-0 max-w-[80%] rounded-2xl px-3.5 py-1.5 text-xs font-bold leading-snug break-words ${
                mine ? "bg-blue text-on-blue" : "bg-bar text-on-bar"
              }`}
            >
              <span className="sr-only">{mine ? "Pengunjung: " : "Valzyy: "}</span>
              {m.content}
            </span>
            {mine && <Avatar who="visitor" />}
          </li>
        );
      })}
      {typing && (
        <li className="flex items-center gap-2" aria-hidden="true">
          <Avatar who="valzyy" />
          <span className="flex gap-1 rounded-pill bg-surface-2 px-3 py-2.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="typing-dot h-1.5 w-1.5 rounded-pill bg-mute" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        </li>
      )}
    </ol>
  );
}
