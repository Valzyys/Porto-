import type { Metadata } from "next";
import { stack, levels } from "@/content/stack";
import { AsciiDivider } from "@/components/ui/AsciiDivider";
import { Reveal } from "@/components/ui/Reveal";
import { Scramble } from "@/components/ui/Scramble";

export const metadata: Metadata = {
  title: "Stack",
  description: "Setlist teknologi Valzyy: Cloudflare Workers, Hono, KV/R2/D1, CockroachDB, Next.js, React Native, bot Telegram & X — dengan level pemakaian yang jujur.",
};

const BLOCKS = "ABCDEFGH";

function Pips({ n }: { n: 1 | 2 | 3 }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[1, 2, 3].map((k) => (
        <span key={k} className={`h-3 w-3 ${k <= n ? (n === 3 ? "bg-pink" : n === 2 ? "bg-mint" : "bg-lemon") : "bg-line"}`} />
      ))}
    </span>
  );
}

// nomor lagu berlanjut antar blok: M01, M02, …
const OFFSETS = stack.map((_, gi) => stack.slice(0, gi).reduce((n, g) => n + g.items.length, 0));

export default function StackPage() {
  return (
    <div className="gutter pb-section pt-28 md:pt-36">
      {/* header: judul kiri, legenda level di kanan */}
      <header className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-end">
        <div>
          <p className="label">04 / stack</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,10vw,8.5rem)] leading-[0.88]">
            <Scramble text="SETLIST" trigger="mount" />
          </h1>
          <p className="mt-6 max-w-xl text-paper/85">
            Teknologi disusun seperti setlist konser: dikelompokkan per blok, diberi nomor lagu. Levelnya pakai tiga tingkat
            — tanpa persentase, karena angka “87% React” itu tidak berarti apa-apa.
          </p>
        </div>
        <dl className="px-border space-y-3 bg-panel p-5">
          {levels.map((l) => (
            <div key={l.id} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-3">
              <dt className="pt-1">
                <Pips n={l.pips} />
                <span className="sr-only">{l.label}</span>
              </dt>
              <dd>
                <span className="font-display text-sm">{l.label}</span>
                <span className="block text-xs text-mute">{l.desc}</span>
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mt-section space-y-16">
        {stack.map((group, gi) => (
          <Reveal as="section" key={group.id} className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12" start="top 88%">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <AsciiDivider index={`BLOK ${BLOCKS[gi]}`} label="" className="lg:hidden" />
              <p className="hidden font-display text-6xl leading-none text-line lg:block">{BLOCKS[gi]}</p>
              <h2 className="mt-4 font-display text-2xl md:text-3xl">{group.title}</h2>
              <p className="mt-2 text-sm text-mute">{group.note}</p>
            </div>
            <ol className="divide-y divide-dashed divide-line border-y border-line">
              {group.items.map((item, ii) => {
                const track = OFFSETS[gi] + ii + 1;
                const lvl = levels.find((l) => l.id === item.level)!;
                return (
                  <li key={item.name} data-reveal className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1 py-4 sm:grid-cols-[3.5rem_1fr_auto] md:py-5">
                    <span className="font-mono text-xs text-mute">M{String(track).padStart(2, "0")}</span>
                    <span className="min-w-0">
                      <span className="block font-display text-base leading-tight md:text-xl">{item.name}</span>
                      <span className="block text-xs text-mute">{item.where}</span>
                    </span>
                    <span className="col-start-2 flex items-center gap-3 sm:col-start-3">
                      <Pips n={lvl.pips} />
                      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-paper/80">{lvl.label}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
