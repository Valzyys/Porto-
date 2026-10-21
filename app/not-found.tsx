import type { Metadata } from "next";
import { blockText } from "@/lib/ascii";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export const metadata: Metadata = { title: "404" };

const BIG = blockText("404", "█", "░");

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="gutter relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-28">
      {/* spotlight yang menyapu kiri-kanan, mencari lagu yang hilang */}
      <div
        data-sweep
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [animation:vzy-sweep_5s_steps(20)_infinite]"
        style={{
          background:
            "radial-gradient(ellipse 22% 60% at var(--spot-x) 35%, color-mix(in srgb, var(--c-lemon) 14%, transparent), transparent 70%)",
        }}
      />
      <pre
        role="img"
        aria-label="404"
        className="relative w-fit max-w-full overflow-hidden text-[4.2vw] leading-[1] text-pink sm:text-[3vw] lg:text-[2.2rem]"
      >
        {BIG.join("\n")}
      </pre>
      <p className="label relative mt-8">error · track not found</p>
      <h1 id="nf-title" className="relative mt-3 max-w-3xl font-display text-[clamp(1.8rem,5vw,3.6rem)] leading-tight">
        Lagu ini nggak ada di setlist.
      </h1>
      <p className="relative mt-4 max-w-xl text-paper/80">
        Halamannya mungkin sudah pindah, atau URL-nya salah ketik. Panggung utama masih nyala kok.
      </p>
      <div className="relative mt-10 flex flex-wrap gap-3">
        <TransitionLink href="/" className="inline-flex items-center gap-2 bg-pink px-5 py-3 font-display text-xs text-ink hover:bg-paper" data-cursor="HOME">
          <PixelIcon name="home" size={14} /> balik ke panggung
        </TransitionLink>
        <TransitionLink href="/projects" className="inline-flex items-center gap-2 border-2 border-paper px-5 py-3 font-display text-xs hover:border-mint hover:text-mint" data-cursor="LIST">
          <PixelIcon name="folder" size={14} /> lihat proyek
        </TransitionLink>
      </div>
      <pre aria-hidden="true" className="relative mt-16 text-xs text-line">
{`> GET ??? 
> 404 · setlist.lookup() → undefined
> saran: coba /projects atau /about`}
      </pre>
    </section>
  );
}
