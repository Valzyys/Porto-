"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { site } from "@/content/site";

const W = 64;
const H = 16;
// bujur ujung barat & timur Pulau Jawa (perkiraan) untuk menaruh penanda
const LON_W = 105.2;
const LON_E = 114.6;

/** Bentuk pulau dibuat prosedural & disederhanakan: ilustrasi, bukan peta akurat. */
function buildLand(): boolean[][] {
  const g = Array.from({ length: H }, () => Array<boolean>(W).fill(false));
  for (let x = 0; x < W; x++) {
    const u = x / (W - 1);
    const center = 5.2 + u * 4.2 + Math.sin(u * 9) * 0.5;
    const thick = 2.6 + Math.sin(u * Math.PI) * 1.6 + Math.sin(u * 23) * 0.45 - (u > 0.94 ? (u - 0.94) * 30 : 0);
    for (let y = 0; y < H; y++) if (Math.abs(y - center) < thick / 2 + 0.3) g[y][x] = true;
  }
  // Madura
  for (let x = 50; x < 59; x++) for (let y = 5; y < 7; y++) if (!(x === 50 && y === 6)) g[y][x] = true;
  return g;
}

const LAND = buildLand();
const MX = Math.round(((site.location.lon - LON_W) / (LON_E - LON_W)) * (W - 1));
// penanda di pesisir utara: baris daratan paling atas pada kolom tersebut
const MY = LAND.findIndex((row) => row[MX]);

export function JavaMap() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-col]", {
          autoAlpha: 0,
          duration: 0.05,
          stagger: { each: 0.012, from: "start" },
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        });
        gsap.to("[data-ping]", { scale: 3, autoAlpha: 0, duration: 1.4, repeat: -1, ease: "power1.out", transformOrigin: "center" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="px-border relative bg-stage p-3 md:p-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        shapeRendering="crispEdges"
        role="img"
        aria-label={`Ilustrasi pixel Pulau Jawa dengan penanda di ${site.location.city}, ${site.location.province}`}
      >
        {Array.from({ length: W }, (_, x) => (
          <g key={x} data-col>
            {LAND.map((row, y) =>
              row[x] ? (
                <rect
                  key={y}
                  x={x}
                  y={y}
                  width="1"
                  height="1"
                  fill={(x + y) % 2 ? "var(--c-line)" : "var(--c-panel)"}
                  opacity={x >= 26 && x <= 44 ? 1 : 0.7}
                />
              ) : (x * 3 + y * 7) % 23 === 0 ? (
                <rect key={y} x={x + 0.4} y={y + 0.4} width="0.2" height="0.2" fill="var(--c-line)" />
              ) : null,
            )}
          </g>
        ))}
        {/* Jawa Tengah disorot tipis */}
        <rect x="26" y="0" width="19" height={H} fill="var(--c-lemon)" opacity="0.05" />
        <rect data-ping x={MX} y={MY} width="1" height="1" fill="var(--c-pink)" />
        <rect x={MX} y={MY} width="1" height="1" fill="var(--c-pink)" />
        <rect x={MX} y={MY - 4} width="0.15" height="3.5" fill="var(--c-pink)" />
      </svg>
      <p
        className="absolute font-display text-[0.6rem] text-pink md:text-xs"
        style={{ left: `calc(${((MX + 1) / W) * 100}% + 4px)`, top: `calc(${((MY - 4) / H) * 100}% + 8px)` }}
      >
        {site.location.city.toUpperCase()}
      </p>
      <p className="mt-2 flex justify-between font-mono text-[0.6rem] uppercase tracking-widest text-mute">
        <span>barat</span>
        <span>pulau jawa</span>
        <span>timur</span>
      </p>
    </div>
  );
}
