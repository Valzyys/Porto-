"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { site } from "@/content/site";

const W = 64;
const H = 16;
// bujur ujung barat & timur Pulau Jawa (perkiraan) untuk menaruh penanda
const LON_W = 105.2;
const LON_E = 114.6;

/** Bentuk pulau dibuat prosedural & disederhanakan: ilustrasi halftone, bukan peta akurat. */
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
    <div ref={ref} className="relative overflow-hidden rounded-card border border-line bg-surface p-4 md:p-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Ilustrasi halftone Pulau Jawa dengan penanda di ${site.location.city}, ${site.location.province}`}
      >
        {Array.from({ length: W }, (_, x) => (
          <g key={x} data-col>
            {LAND.map((row, y) =>
              row[x] ? (
                <circle
                  key={y}
                  cx={x + 0.5}
                  cy={y + 0.5}
                  r={x >= 26 && x <= 44 ? 0.42 : 0.32}
                  fill={x >= 26 && x <= 44 ? "var(--c-blue)" : "var(--c-mute)"}
                />
              ) : null,
            )}
          </g>
        ))}
        <circle data-ping cx={MX + 0.5} cy={MY + 0.5} r="0.7" fill="var(--c-orange)" />
        <circle cx={MX + 0.5} cy={MY + 0.5} r="0.7" fill="var(--c-orange)" stroke="var(--c-line)" strokeWidth="0.15" />
        <path d={`M${MX + 0.5} ${MY - 0.3}V${MY - 4}`} stroke="var(--c-line)" strokeWidth="0.12" />
      </svg>
      <p
        className="absolute rounded-xs bg-blue px-1.5 py-0.5 text-[0.625rem] font-bold text-on-blue"
        style={{ left: `calc(${((MX + 1) / W) * 100}% + 6px)`, top: `calc(${((MY - 4) / H) * 100}% + 6px)` }}
      >
        {site.location.city.toUpperCase()}
      </p>
      <p className="micro mt-3 flex justify-between text-mute">
        <span>Barat</span>
        <span>Pulau Jawa</span>
        <span>Timur</span>
      </p>
    </div>
  );
}
