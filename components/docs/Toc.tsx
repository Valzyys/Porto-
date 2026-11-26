"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { scrollToHash } from "@/components/providers/SmoothScroll";

export type TocItem = { id: string; text: string; depth: 2 | 3; mono?: boolean };

/** "On this page": scroll-spy + indikator biru yang meluncur ke item aktif. */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    const li = listRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(active)}"]`);
    if (!li || !barRef.current) return;
    gsap.to(barRef.current, { y: li.offsetTop, height: li.offsetHeight, duration: motion.dur.fast, ease: motion.ease.out });
  }, [active]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Di halaman ini" className="sticky top-[calc(var(--s-bar)+2rem)] max-h-[calc(100svh-var(--s-bar)-4rem)] overflow-y-auto" data-lenis-prevent>
      <p className="micro text-mute">On this page</p>
      <ul ref={listRef} className="relative mt-3 border-l border-line">
        <span ref={barRef} aria-hidden="true" className="absolute -left-px top-0 w-0.5 bg-blue" />
        {items.map((i) => (
          <li key={i.id} data-id={i.id}>
            <a
              href={`#${i.id}`}
              onClick={(e) => {
                e.preventDefault();
                window.history.replaceState(null, "", `#${i.id}`);
                scrollToHash(i.id);
                setActive(i.id);
              }}
              className={`block py-1 text-[13px] leading-snug transition-colors duration-150 ${i.depth === 3 ? "pl-6" : "pl-3"} ${i.mono ? "font-mono text-[12px]" : ""} ${
                active === i.id ? "text-ink" : "text-mute hover:text-ink"
              }`}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
