"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { blockText } from "@/lib/ascii";
import { motion } from "@/design/tokens";
import { site, contacts } from "@/content/site";
import { Marquee } from "@/components/ui/Marquee";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Clock } from "@/components/ui/Clock";
import { scrollToTop, lenisRef } from "@/components/providers/SmoothScroll";

const YEAR = 2026;

const github = contacts.find((c) => c.id === "github");

/** Kredit penutup ala film konser: peran …… nama. Semua fakta. */
const CREDITS: [string, string][] = [
  ["Starring", site.name],
  ["Peran", site.role],
  ["Basis", `${site.location.city}, ${site.location.province}, ${site.location.country}`],
  ["Founder", `${site.founderOf} (sejak ${site.since})`],
  ["IT lintas divisi", "Cavallery · FritzyForce · Nayrakuen"],
  ["Paket npm", "@jkt48/core · @jkt48connect/cli"],
  ["Kontak", github?.href ? github.href.replace("https://", "") : "—"],
  ["Dibangun dengan", "Next.js · Tailwind · GSAP · Lenis"],
  ["Tayang di", "Cloudflare Workers"],
  ["Font", "Bricolage Grotesque · JetBrains Mono · Silkscreen (OFL)"],
  ["Catatan", "Situs pribadi. Tidak berafiliasi resmi dengan JKT48."],
];

const SIGNATURE = blockText("VALZYY", "█", " ");

/**
 * Footer = credit roll. Daftar kredit bergulir naik mengikuti scroll,
 * ditutup signature ASCII. Bukan footer 4 kolom.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const roll = ref.current?.querySelector<HTMLElement>("[data-roll]");
      const sig = gsap.utils.toArray<HTMLElement>("[data-sig-row]", ref.current);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (roll) {
          gsap.fromTo(
            roll,
            { yPercent: 18 },
            {
              yPercent: -18,
              ease: "none",
              scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
            },
          );
        }
        gsap.fromTo(
          sig,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: motion.ease.smooth,
            duration: 1.1,
            stagger: 0.08,
            scrollTrigger: { trigger: sig[0], start: "top 95%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative mt-section overflow-hidden border-t-4 border-line bg-ink pb-28 md:pb-16">
      <Marquee
        label="Terima kasih sudah mampir"
        className="border-b border-line bg-paper py-3 text-ink"
        itemClassName="font-display text-lg md:text-2xl"
        speed={0.8}
        separator={<PixelIcon name="star" size={16} className="mx-5" />}
        items={["TERIMA KASIH SUDAH MAMPIR", "SAMPAI KETEMU DI SHOW BERIKUTNYA", "ENCORE?"]}
      />

      <div className="gutter relative">
        <p className="label mt-14 text-center">— end credits —</p>

        <div className="relative mx-auto mt-8 h-[26rem] max-w-3xl overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] md:h-[30rem]">
          <dl data-roll className="flex flex-col gap-5 py-16">
            {CREDITS.map(([role, name]) => (
              <div key={role} className="grid grid-cols-1 gap-1 text-center sm:grid-cols-[1fr_auto_minmax(0,1fr)] sm:gap-4 sm:text-left">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-mute sm:text-right">{role}</dt>
                <span aria-hidden="true" className="hidden text-line sm:block">
                  ······
                </span>
                <dd className={role === "Starring" ? "font-display text-2xl text-pink" : "text-sm text-paper"}>{name}</dd>
              </div>
            ))}
          </dl>
        </div>

        <pre
          aria-label={`Tanda tangan ASCII: ${site.name}`}
          role="img"
          className="mx-auto mt-10 w-fit max-w-full overflow-hidden text-[2.1vw] leading-[1.05] text-pink sm:text-[1.3vw] lg:text-[0.95rem]"
        >
          {SIGNATURE.map((row, i) => (
            <span key={i} data-sig-row className="block" style={{ color: `var(--c-${["pink", "pink", "peach", "lemon", "mint"][i]})` }}>
              {row}
            </span>
          ))}
        </pre>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-mute md:flex-row">
          <p>
            © {YEAR} {site.name} · {site.location.city}, {site.location.province}
          </p>
          <p className="font-mono tracking-widest">
            LOCAL <Clock />
          </p>
          <button
            type="button"
            onClick={() => (lenisRef.current ? lenisRef.current.scrollTo(0, { duration: 1.6 }) : scrollToTop())}
            className="flex items-center gap-2 px-2 py-1 text-paper hover:text-lemon"
            data-cursor="UP"
          >
            <PixelIcon name="up" size={12} /> balik ke atas
          </button>
        </div>
      </div>
    </footer>
  );
}
