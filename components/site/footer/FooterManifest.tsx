"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { footerCols, type NavLink } from "@/content/site";
import { pkg } from "@/content/pkg";
import { TransitionLink } from "@/components/transition/TransitionLink";

type Line = { indent: number; key?: string; value?: string; open?: string; close?: string; comma?: boolean; link?: NavLink };

const short = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** sitemap ditulis sebagai file JSON (dibangun dari footerCols) */
const LINES: Line[] = (() => {
  const out: Line[] = [{ indent: 0, open: "{" }];
  out.push({ indent: 1, key: "name", value: pkg.name, comma: true });
  out.push({ indent: 1, key: "version", value: pkg.version, comma: true });
  footerCols.forEach((col) => {
    out.push({ indent: 1, key: col.title.toLowerCase(), open: "{" });
    col.links.forEach((l, i) => out.push({ indent: 2, key: l.label.toLowerCase(), value: l.external ? short(l.href) : l.href, comma: i < col.links.length - 1, link: l }));
    out.push({ indent: 1, close: "}", comma: true });
  });
  out.push({ indent: 1, key: "license", value: pkg.license, comma: true });
  out.push({ indent: 1, key: "author", value: pkg.author });
  out.push({ indent: 0, close: "}" });
  return out;
})();

/**
 * Panel `footer.json`: tiap baris link bisa diklik. Baris muncul bergiliran
 * saat masuk viewport; penanda biru meluncur mengikuti baris yang di-hover.
 */
export function FooterManifest() {
  const root = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-ln]", {
          autoAlpha: 0,
          x: -10,
          duration: 0.45,
          ease: motion.ease.out,
          stagger: 0.035,
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const show = (el: HTMLElement) => {
    const m = marker.current;
    if (!m) return;
    gsap.to(m, { y: el.offsetTop, height: el.offsetHeight, autoAlpha: 1, duration: motion.dur.fast, ease: motion.ease.out });
  };
  const hide = () => marker.current && gsap.to(marker.current, { autoAlpha: 0, duration: motion.dur.fast });

  const body = (l: Line) => (
    <>
      <span style={{ paddingLeft: `${l.indent * 2}ch` }} />
      {l.key && (
        <>
          <span className="text-ink">&quot;{l.key}&quot;</span>
          <span className="text-mute">: </span>
        </>
      )}
      {l.value && <span className={l.link ? "tk-s group-hover:text-blue" : "tk-s"}>&quot;{l.value}&quot;</span>}
      {l.open && <span className="text-mute">{l.open}</span>}
      {l.close && <span className="text-mute">{l.close}</span>}
      {l.comma && <span className="text-mute">,</span>}
      {l.link?.external && <span className="ml-2 text-mute group-hover:text-blue">↗</span>}
      {l.link && <span className="ml-auto pl-4 text-mute opacity-0 transition-opacity duration-150 group-hover:opacity-100">↵</span>}
    </>
  );

  return (
    <div className="border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="micro flex items-center gap-2 text-mute">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-2 w-2 bg-px2" />
            <span className="h-2 w-2 bg-px3" />
            <span className="h-2 w-2 bg-blue" />
          </span>
          footer.json
        </span>
        <span className="micro text-mute">sitemap</span>
      </div>
      <div ref={root} onPointerLeave={hide} className="relative overflow-x-auto py-3 font-mono text-[13px] leading-7">
        <span ref={marker} aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 w-full border-l-2 border-blue bg-blue-soft/60" />
        <ol>
          {LINES.map((l, i) => (
            <li key={i} data-ln className="relative flex">
              <span aria-hidden="true" className="w-10 shrink-0 select-none pr-3 text-right tabular-nums text-mute/60">
                {i + 1}
              </span>
              {l.link ? (
                l.link.external ? (
                  <a href={l.link.href} target="_blank" rel="noreferrer" onPointerEnter={(e) => show(e.currentTarget.parentElement!)} onFocus={(e) => show(e.currentTarget.parentElement!)} className="group flex min-w-0 flex-1 items-center whitespace-pre pr-4">
                    {body(l)}
                    <span className="sr-only">(tab baru)</span>
                  </a>
                ) : (
                  <TransitionLink href={l.link.href} onPointerEnter={(e) => show(e.currentTarget.parentElement!)} onFocus={(e) => show(e.currentTarget.parentElement!)} className="group flex min-w-0 flex-1 items-center whitespace-pre pr-4">
                    {body(l)}
                  </TransitionLink>
                )
              ) : (
                <span className="flex min-w-0 flex-1 items-center whitespace-pre pr-4">
                  {body(l)}
                  {i === LINES.length - 1 && <span aria-hidden="true" className="caret ml-1 inline-block h-[1.1em] w-[0.5em] bg-blue" />}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
