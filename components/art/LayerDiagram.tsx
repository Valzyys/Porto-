"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { rng } from "@/lib/pixel";
import { modules } from "@/content/api";
import { pkg } from "@/content/pkg";
import { Icon } from "@/components/ui/Icon";

const W = 1000;
const CELL = 10;

type Layer = { id: string; label: string; sub: string; title: string; text: string; rows: number; density: number; tone: "grey" | "blue" | "dark" };

const services = modules.filter((m) => m.prop).map((m) => m.prop as string);

const LAYERS: Layer[] = [
  { id: "app", label: "your app", sub: "node · browser · react", title: "Aplikasimu", text: "Satu `new JKT48Client({ apiKey })`. Semua data JKT48Connect lewat satu objek itu.", rows: 3, density: 0.35, tone: "grey" },
  { id: "client", label: "JKT48Client", sub: "check · set*", title: "JKT48Client", text: "Menyimpan kredensial dan membuka tujuh layanan sebagai properti: " + services.map((s) => `\`${s}\``).join(", ") + ".", rows: 3, density: 0.75, tone: "dark" },
  { id: "services", label: "services", sub: `${services.length} modul`, title: "Services", text: "Setiap layanan memetakan method ke endpoint, mis. `members.getMembers()` → `GET /jkt48/members`.", rows: 6, density: 0.6, tone: "blue" },
  { id: "http", label: "HttpClient", sub: "axios", title: "HttpClient", text: "Menempelkan `apikey`, priority token, dan kredensial admin; membungkus error jadi pesan yang jelas.", rows: 3, density: 0.7, tone: "dark" },
  { id: "api", label: "the API", sub: "v2.jkt48connect.com", title: "JKT48Connect API", text: `Semua request menuju \`${pkg.baseUrl}\`. Respons dikembalikan apa adanya.`, rows: 4, density: 0.4, tone: "grey" },
];

function bandCells(layer: Layer, y0: number, seed: number) {
  const rand = rng(seed);
  const cols = Math.floor((W - 230) / CELL);
  const out: { x: number; y: number; f: string }[] = [];
  for (let r = 0; r < layer.rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = rand();
      const edge = Math.sin(c * 0.21 + seed) * 0.25;
      if (v > layer.density + edge * (r === 0 || r === layer.rows - 1 ? 1 : 0)) continue;
      let f = v < 0.3 ? "var(--c-px-1)" : v < 0.6 ? "var(--c-px-2)" : "var(--c-px-3)";
      if (layer.tone === "dark" && v < 0.45) f = v < 0.2 ? "var(--c-ink)" : "var(--c-px-4)";
      if (layer.tone === "blue") {
        const blk = Math.floor(c / (cols / services.length));
        f = blk % 2 ? (v < 0.35 ? "var(--c-blue)" : "color-mix(in srgb, var(--c-blue) 45%, var(--c-canvas))") : v < 0.25 ? "var(--c-px-3)" : "var(--c-px-2)";
      }
      out.push({ x: 160 + c * CELL, y: y0 + r * CELL, f });
    }
  }
  return out;
}

/** Posisi tiap lapisan — statis, dihitung sekali saat modul dimuat. */
const LAYOUT = LAYERS.reduce<(Layer & { y0: number; h: number; cells: ReturnType<typeof bandCells> })[]>((acc, l, i) => {
  const prev = acc[acc.length - 1];
  const y0 = prev ? prev.y0 + prev.h + 22 : 10;
  acc.push({ ...l, y0, h: l.rows * CELL, cells: bandCells(l, y0, i * 31 + 7) });
  return acc;
}, []);

/**
 * Diagram lapisan: aplikasi → client → services → HttpClient → API.
 * Paket biru turun (request), paket gelap naik (respons). Stepper di bawah
 * menyorot satu lapisan dan berganti otomatis.
 */
export function LayerDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const layout = LAYOUT;
  const H = layout[layout.length - 1].y0 + layout[layout.length - 1].h + 10;

  // paket mengalir
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const down = gsap.utils.toArray<SVGRectElement>("[data-down]", ref.current);
        const up = gsap.utils.toArray<SVGRectElement>("[data-up]", ref.current);
        const flow = (el: SVGRectElement, dist: number, delay: number) => {
          const tl = gsap.timeline({ repeat: -1, delay, repeatDelay: 0.4 });
          tl.fromTo(el, { y: 0 }, { y: dist, duration: 2.6, ease: "none" }, 0)
            .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0)
            .to(el, { opacity: 0, duration: 0.3 }, 2.3);
        };
        down.forEach((el, i) => flow(el, H - 30, i * 0.55));
        up.forEach((el, i) => flow(el, -(H - 30), 1.2 + i * 0.55));
        gsap.from("[data-band] rect", {
          opacity: 0,
          duration: 0.4,
          stagger: { amount: 1.2, from: "start" },
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [H] },
  );

  // sorot lapisan aktif + ganti otomatis
  useGSAP(
    () => {
      gsap.to("[data-band]", { opacity: (i: number) => (i === active ? 1 : 0.35), duration: motion.dur.base, ease: motion.ease.out });
      gsap.fromTo("[data-caption]", { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: motion.dur.base, ease: motion.ease.out });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const id = window.setTimeout(() => setActive((a) => (a + 1) % LAYERS.length), 4200);
      return () => window.clearTimeout(id);
    },
    { scope: ref, dependencies: [active] },
  );

  const cur = layout[active];

  return (
    <figure ref={ref} className="border-y border-line py-8">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[640px]" role="img" aria-label="Diagram lapisan @jkt48/core: aplikasi, JKT48Client, services, HttpClient, API">
          {layout.map((l, i) => (
            <g key={l.id} data-band>
              <text x="150" y={l.y0 + l.h / 2 - 2} textAnchor="end" className="fill-ink font-mono" fontSize="13">
                {l.label}
              </text>
              <text x="150" y={l.y0 + l.h / 2 + 13} textAnchor="end" className="fill-mute font-mono" fontSize="10">
                {l.sub}
              </text>
              {l.cells.map((c, k) => (
                <rect key={k} x={c.x} y={c.y} width={CELL - 2} height={CELL - 2} fill={c.f} />
              ))}
              {i === 2 &&
                services.map((s, k) => (
                  <text
                    key={s}
                    x={160 + ((W - 230) / services.length) * (k + 0.5)}
                    y={l.y0 + l.h + 14}
                    textAnchor="middle"
                    className="fill-mute font-mono"
                    fontSize="9"
                  >
                    {s}
                  </text>
                ))}
            </g>
          ))}
          {/* jalur & paket */}
          <line x1={W - 50} y1={10} x2={W - 50} y2={H - 10} stroke="var(--c-line)" strokeDasharray="3 4" />
          <line x1={W - 30} y1={10} x2={W - 30} y2={H - 10} stroke="var(--c-line)" strokeDasharray="3 4" />
          {[0, 1, 2].map((i) => (
            <rect key={`d${i}`} data-down x={W - 54} y={10} width="8" height="8" fill="var(--c-blue)" opacity="0" />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={`u${i}`} data-up x={W - 34} y={H - 20} width="8" height="8" fill="var(--c-ink)" opacity="0" />
          ))}
          <text x={W - 50} y={H} textAnchor="middle" className="fill-mute font-mono" fontSize="9">
            req
          </text>
          <text x={W - 30} y={8} textAnchor="middle" className="fill-mute font-mono" fontSize="9">
            res
          </text>
        </svg>
      </div>

      <figcaption className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div data-caption className="min-w-0">
          <p className="text-[15px] font-medium text-ink">{cur.title}</p>
          <p className="mt-1 max-w-xl text-sm text-mute">
            {cur.text.split(/(`[^`]+`)/).map((part, i) =>
              part.startsWith("`") ? (
                <code key={i} className="ic">
                  {part.slice(1, -1)}
                </code>
              ) : (
                part
              ),
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="btn btn-light" onClick={() => setActive((a) => (a - 1 + LAYERS.length) % LAYERS.length)} aria-label="Lapisan sebelumnya">
            <Icon name="arrowLeft" size={12} /> prev
          </button>
          <div className="flex gap-1.5" role="tablist" aria-label="Lapisan">
            {LAYERS.map((l, i) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={l.title}
                onClick={() => setActive(i)}
                className={`h-2 w-2 transition-colors duration-150 ${i === active ? "bg-blue" : "bg-px2 hover:bg-px3"}`}
              />
            ))}
          </div>
          <button type="button" className="btn btn-light" onClick={() => setActive((a) => (a + 1) % LAYERS.length)} aria-label="Lapisan berikutnya">
            next <Icon name="arrowRight" size={12} />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
