import type { Metadata } from "next";
import { MaskedBanner } from "@/components/art/MaskedBanner";
import { ChatLog } from "@/components/ui/ChatLog";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/transition/TransitionLink";

export const metadata: Metadata = { title: "404" };

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="page-wrap flex flex-col gap-10 pt-4 md:pt-8">
      <div className="rounded-card border border-line px-5 py-4 md:px-8 md:py-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[0.9375rem] text-mute">Loading page…</p>
          <p className="text-sm tabular-nums">ERR</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface-2" aria-hidden="true">
          <div className="h-full w-[38%] rounded-pill bg-orange" />
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-mute">
          <Icon name="clock" size={14} /> track not found
        </p>
      </div>

      <MaskedBanner text="404" label="Ilustrasi di dalam angka 404" tone="orange" />

      <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <span className="rounded-xs bg-blue px-1.5 py-0.5 text-[0.6875rem] font-bold text-on-blue">ERR.404</span>
          <h1 id="nf-title" className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[0.95] tracking-tight">
            Lagu ini nggak ada di setlist <span className="text-mute">{"//"}</span>
          </h1>
          <p className="mt-4 max-w-lg text-mute">Halamannya mungkin sudah pindah, atau URL-nya salah ketik. Panggung utama masih nyala kok.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TransitionLink href="/" className="inline-flex items-center gap-2 rounded-pill bg-blue px-5 py-3 text-sm font-bold text-on-blue hover:bg-ink hover:text-canvas">
              <Icon name="arrowLeft" size={16} /> Balik ke beranda
            </TransitionLink>
            <TransitionLink href="/projects" className="inline-flex items-center gap-2 rounded-pill border border-line px-5 py-3 text-sm font-bold hover:bg-ink hover:text-canvas">
              Lihat proyek <Icon name="arrowUpRight" size={16} />
            </TransitionLink>
          </div>
        </div>
        <ChatLog
          label="Obrolan 404"
          typing={false}
          items={[
            { key: "1", from: "visitor", content: "Halamannya ke mana?" },
            { key: "2", from: "valzyy", content: "Nggak ada di setlist." },
            { key: "3", from: "visitor", content: "…" },
            { key: "4", from: "system", content: "— GET ??? → 404 —" },
          ]}
        />
      </div>
    </section>
  );
}
