"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { modules, callOf, anchorOf } from "@/content/api";
import { verbClass } from "@/components/modules/verbs";
import { TransitionLink } from "@/components/transition/TransitionLink";

const ITEMS = modules.flatMap((m) =>
  m.methods.map((x) => ({ key: `${m.id}.${x.name}`, call: `${callOf(m, x)}()`, verb: x.path === "—" ? "local" : x.verb, href: `/docs/api/${m.id}#${anchorOf(x)}` })),
);

/**
 * Pita berjalan berisi semua method (dari content/api.ts). Hover → melambat,
 * scroll halaman → arah/kecepatan ikut kecepatan scroll sesaat.
 */
export function MethodMarquee() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tw = gsap.to(track.current, { xPercent: -50, duration: 90, ease: "none", repeat: -1 });
        const slow = () => gsap.to(tw, { timeScale: 0.15, duration: 0.5 });
        const fast = () => gsap.to(tw, { timeScale: 1, duration: 0.5 });
        let lastY = window.scrollY;
        let idle = 0;
        const onScroll = () => {
          const dy = window.scrollY - lastY;
          lastY = window.scrollY;
          gsap.to(tw, { timeScale: Math.max(-6, Math.min(6, 1 + dy * 0.25)), duration: 0.2, overwrite: true });
          clearTimeout(idle);
          idle = window.setTimeout(fast, 160);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        const el = root.current!;
        const hover = window.matchMedia(FINE_POINTER).matches;
        if (hover) {
          el.addEventListener("pointerenter", slow);
          el.addEventListener("pointerleave", fast);
        }
        return () => {
          window.removeEventListener("scroll", onScroll);
          clearTimeout(idle);
          el.removeEventListener("pointerenter", slow);
          el.removeEventListener("pointerleave", fast);
          tw.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = (dup: boolean) =>
    ITEMS.map((it) => (
      <li key={(dup ? "b" : "a") + it.key} className="flex shrink-0 items-center gap-2 border-r border-line px-5 py-3">
        <span className={`micro border px-1.5 py-0.5 ${verbClass[it.verb]}`}>{it.verb}</span>
        <TransitionLink href={it.href} tabIndex={dup ? -1 : undefined} className="font-mono text-[13px] text-ink/85 transition-colors duration-150 hover:text-blue">
          {it.call}
        </TransitionLink>
      </li>
    ));

  return (
    <nav ref={root} className="overflow-hidden" aria-label="Daftar method">
      <div ref={track} className="flex w-max">
        <ul className="flex">{row(false)}</ul>
        <ul className="flex" aria-hidden="true">
          {row(true)}
        </ul>
      </div>
    </nav>
  );
}
