import type { Metadata } from "next";
import { stack, levels } from "@/content/stack";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Stack",
  description: "Setlist teknologi Valzyy: Cloudflare Workers, Hono, KV/R2/D1, CockroachDB, Next.js, React Native, bot Telegram & X — dengan level pemakaian yang jujur.",
};

const BLOCKS = "ABCDEFGH";
// nomor berlanjut antar blok: M01, M02, …
const OFFSETS = stack.map((_, gi) => stack.slice(0, gi).reduce((n, g) => n + g.items.length, 0));
const TOTAL = stack.reduce((n, g) => n + g.items.length, 0);

/** Indikator level 3 segmen — bukan persentase. */
function Level({ pips }: { pips: 1 | 2 | 3 }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[1, 2, 3].map((k) => (
        <span key={k} className={`h-2 w-6 rounded-pill ${k <= pips ? (pips === 3 ? "bg-blue" : pips === 2 ? "bg-ink" : "bg-orange") : "bg-surface-2"}`} />
      ))}
    </span>
  );
}

export default function StackPage() {
  const total = String(TOTAL).padStart(2, "0");
  return (
    <>
      <PageHero status="Loading setlist…" banner={total} bannerLabel={`Ilustrasi di dalam angka ${total}, jumlah teknologi`} mirror />

      <section aria-labelledby="stack-title" className="page-wrap pt-section">
        <SectionHead
          as="h1"
          id="stack-title"
          title="Stack"
          badge={`04 / 05 · ${total} TECH`}
          meta="Disusun seperti setlist. Level tiga tingkat — tanpa persentase"
        />

        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          {levels.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-4 rounded-card border border-line px-4 py-3">
              <div>
                <dt className="text-sm font-extrabold">{l.label}</dt>
                <dd className="text-xs text-mute">{l.desc}</dd>
              </div>
              <Level pips={l.pips} />
            </div>
          ))}
        </dl>

        <div className="mt-10 space-y-5">
          {stack.map((group, gi) => (
            <Reveal as="section" key={group.id} className="grid gap-5 rounded-card border border-line p-5 md:p-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" start="top 88%">
              <div className="lg:border-r lg:border-hair lg:pr-6">
                <span className="rounded-xs bg-blue px-1.5 py-0.5 text-[0.6875rem] font-bold text-on-blue">BLOK {BLOCKS[gi]}</span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                  {group.title} <span className="text-mute">{"//"}</span>
                </h2>
                <p className="mt-1 text-sm text-mute">{group.note}</p>
              </div>
              <ol className="divide-y divide-hair">
                {group.items.map((item, ii) => {
                  const lvl = levels.find((l) => l.id === item.level)!;
                  return (
                    <li key={item.name} data-reveal className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-3 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto]">
                      <span className="micro tabular-nums text-mute">M{String(OFFSETS[gi] + ii + 1).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-base font-bold tracking-tight md:text-lg">{item.name}</span>
                        <span className="block truncate text-xs text-mute">{item.where}</span>
                      </span>
                      <span className="col-start-2 flex items-center gap-3 sm:col-start-3">
                        <Level pips={lvl.pips} />
                        <span className="micro w-24 text-ink/80">{lvl.label}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
