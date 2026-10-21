"use client";

import { useRef } from "react";
import { gsap, useGSAP, FINE_POINTER, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { stack } from "@/content/stack";
import { Counter } from "@/components/ui/Counter";
import { PixelIcon } from "@/components/pixel/PixelIcon";

/** Statistik kartu — semuanya DIHITUNG dari isi situs / fakta terverifikasi. */
const STATS: { label: string; value: number; note: string }[] = [
  { label: "Proyek", value: projects.length, note: "di halaman /projects" },
  { label: "Teknologi", value: stack.filter((g) => g.id !== "lab").flatMap((g) => g.items).length, note: "di halaman /stack" },
  { label: "Paket npm", value: 2, note: "@jkt48/core, @jkt48connect/cli" },
  { label: "Platform bot", value: 3, note: "X, WhatsApp, Telegram" },
];

/**
 * Kartu ala "member card" idol: nama, peran, asal, debut, dan stats jujur.
 * Desktop: miring mengikuti kursor + kilau. Mobile: statis.
 */
export function ProfileCard() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = ref.current?.querySelector<HTMLElement>("[data-card]");
      const shine = ref.current?.querySelector<HTMLElement>("[data-shine]");
      if (!card || !shine) return;
      const mm = gsap.matchMedia();
      mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
        gsap.set(card, { transformPerspective: 900 });
        const rx = gsap.quickTo(card, "rotationX", { duration: motion.dur.base, ease: motion.ease.out });
        const ry = gsap.quickTo(card, "rotationY", { duration: motion.dur.base, ease: motion.ease.out });
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rx(-py * 14);
          ry(px * 18);
          shine.style.setProperty("--sx", `${(px + 0.5) * 100}%`);
          shine.style.setProperty("--sy", `${(py + 0.5) * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="w-full max-w-sm">
      <article
        data-card
        aria-label={`Kartu profil ${site.name}`}
        className="px-border relative bg-panel p-4 [--px-c:var(--c-pink)] will-change-transform"
        data-cursor="HELLO"
      >
        <div
          data-shine
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at var(--sx,30%) var(--sy,20%), color-mix(in srgb, var(--c-lemon) 22%, transparent), transparent 45%)",
          }}
        />
        <header className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest">
          <span className="text-pink">member card</span>
          <span className="text-mute">no. 001</span>
        </header>

        <div className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
          {/* "foto": ilustrasi pixel di atas latar dither, bukan foto asli */}
          <div className="dither-coarse relative grid aspect-[3/4] place-items-center bg-stage [--dither-c:var(--c-line)]">
            <PixelIcon name="idol" size={64} className="text-lemon" label="Ilustrasi pixel pengganti foto" />
            <span className="absolute bottom-1 left-1 bg-ink px-1 font-mono text-[0.55rem] text-mute">NO PHOTO</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-2xl leading-none text-paper">{site.name.toUpperCase()}</h3>
            <p className="mt-1 text-xs text-mute">{site.roleShort} · founder {site.founderOf}</p>
            <dl className="mt-3 space-y-1 text-[0.72rem]">
              <div className="flex justify-between gap-2 border-b border-dashed border-line pb-1">
                <dt className="text-mute">ASAL</dt>
                <dd className="text-right">{site.location.city}, Jateng</dd>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed border-line pb-1">
                <dt className="text-mute">DEBUT</dt>
                <dd>{site.since}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-mute">PENLIGHT</dt>
                <dd className="flex gap-1" aria-label="pink dan mint">
                  <span className="h-3 w-3 bg-pink" />
                  <span className="h-3 w-3 bg-mint" />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2">
          {STATS.map((s) => (
            <div key={s.label} className="bg-stage px-3 py-2" title={s.note}>
              <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-mute">{s.label}</dt>
              <dd className="font-display text-2xl leading-tight text-lemon">
                <Counter value={s.value} />
              </dd>
              <dd className="truncate text-[0.6rem] text-mute">{s.note}</dd>
            </div>
          ))}
        </dl>

        {/* strip "barcode" pixel dari nama */}
        <div aria-hidden="true" className="mt-4 flex h-6 items-stretch gap-[2px]">
          {site.name
            .toUpperCase()
            .split("")
            .flatMap((ch, i) => {
              const code = ch.charCodeAt(0);
              return [code % 3, code % 5, (code >> 2) % 4].map((v, j) => (
                <span key={`${i}-${j}`} className="bg-paper" style={{ width: `${(v + 1) * 2}px` }} />
              ));
            })}
          <span className="ml-auto self-end font-mono text-[0.55rem] text-mute">VZY-2024</span>
        </div>
      </article>
    </div>
  );
}
