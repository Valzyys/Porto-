import { modules, methodCount, httpMethods } from "@/content/api";
import { pkg } from "@/content/pkg";
import { Headline } from "@/components/ui/Headline";
import { InstallBox } from "@/components/ui/InstallBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PixelBars } from "@/components/art/PixelBars";
import { PixelArt } from "@/components/art/PixelArt";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { moduleIcon } from "@/components/site/moduleIcons";

const stats = [
  { label: "Modul", value: modules.length, note: "client + 7 layanan" },
  { label: "Method", value: methodCount, note: `${httpMethods.length} memanggil HTTP` },
  { label: "Dependensi", value: 1, note: pkg.dependency.name },
  { label: "Format", value: 3, note: "ESM · CJS · UMD" },
];

const quick = `import JKT48Client from "@jkt48/core";

const client = new JKT48Client({ apiKey: process.env.JKT48_API_KEY });

const live = await client.live.getLive();`;

export default function Home() {
  return (
    <div className="page-wrap pt-12 md:pt-14">
      {/* bingkai hero */}
      <section className="border border-line">
        <div className="relative">
          <div className="px-6 pt-8 md:px-9 md:pt-10">
            <Headline
              lead="@jkt48/core"
              rest="client JavaScript untuk semua data JKT48Connect."
              className="max-w-3xl text-[28px] leading-[1.15] md:text-[44px]"
            />
          </div>
          <div className="mt-6 h-36 md:mt-2 md:h-40">
            <PixelBars />
          </div>
        </div>

        <div className="border-t border-line px-4 py-10 md:py-12">
          <InstallBox className="mx-auto max-w-3xl" />
          <p className="micro mx-auto mt-4 max-w-3xl text-center text-mute">
            v{pkg.version} · {pkg.license} · Node.js &amp; browser · 1 dependensi ({pkg.dependency.name})
          </p>
        </div>

        {/* dua panel ilustrasi */}
        <div className="grid border-t border-line md:grid-cols-2">
          <Reveal className="flex flex-col p-6 md:border-r md:border-line md:p-9">
            <div className="mx-auto w-full max-w-md py-4">
              <PixelArt name="cube" label="Ilustrasi pixel kubus paket npm" />
            </div>
            <p data-reveal className="micro mt-6 text-mute">
              NPM package
            </p>
            <h2 data-reveal className="mt-2 text-[28px] font-medium tracking-[-0.02em]">
              @jkt48/core
            </h2>
            <p data-reveal className="mt-3 max-w-md text-mute">
              Satu class <code className="ic">JKT48Client</code>, tujuh layanan siap pakai. ESM, CommonJS, dan UMD dalam satu paket — jalan di Node.js, browser, dan React.
            </p>
            <div data-reveal className="mt-6 flex flex-wrap gap-2">
              <TransitionLink href="/docs/quickstart" className="btn btn-dark">
                Quickstart <Icon name="chevronRight" size={12} />
              </TransitionLink>
              <TransitionLink href="/docs" className="btn btn-light">
                Docs
              </TransitionLink>
              <a href={pkg.links.npm} target="_blank" rel="noreferrer" className="btn btn-light">
                npm <Icon name="arrowUpRight" size={11} />
              </a>
            </div>
          </Reveal>
          <Reveal className="flex flex-col border-t border-line p-6 md:border-t-0 md:p-9">
            <div className="mx-auto w-full max-w-md py-4">
              <PixelArt name="tower" label="Ilustrasi pixel menara pemancar" />
            </div>
            <p data-reveal className="micro mt-6 text-mute">
              Live data
            </p>
            <h2 data-reveal className="mt-2 text-[28px] font-medium tracking-[-0.02em]">
              JKT48Connect API
            </h2>
            <p data-reveal className="mt-3 max-w-md text-mute">
              Member, theater, event, video call, berita, dan live dari YouTube, IDN, serta Showroom — semua lewat <code className="ic">{pkg.baseUrl.replace("https://", "")}</code>.
            </p>
            <div data-reveal className="mt-6 flex flex-wrap gap-2">
              <TransitionLink href="/docs/api/client" className="btn btn-dark">
                API reference <Icon name="chevronRight" size={12} />
              </TransitionLink>
              <TransitionLink href="/docs/endpoints" className="btn btn-light">
                Endpoints
              </TransitionLink>
              <TransitionLink href="/modules" className="btn btn-light">
                Modules
              </TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* angka dari data paket */}
      <Reveal as="section" className="grid grid-cols-2 border-x border-b border-line md:grid-cols-4" aria-label="Ringkasan paket">
        {stats.map((s, i) => (
          <div key={s.label} data-reveal className={`p-6 md:p-8 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
            <p className="micro text-mute">{s.label}</p>
            <p className="mt-2 text-[40px] font-medium leading-none tabular-nums tracking-[-0.03em]">
              <Counter value={s.value} pad={2} />
            </p>
            <p className="micro mt-2 text-mute">{s.note}</p>
          </div>
        ))}
      </Reveal>

      {/* modul */}
      <section className="mt-section" aria-label="Modules">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Headline as="h2" lead="Modules" rest="blok-blok penyusun client." className="text-[28px] leading-tight md:text-[40px]" />
          <TransitionLink href="/modules" className="btn btn-dark">
            Browse modules <Icon name="chevronRight" size={12} />
          </TransitionLink>
        </div>
        <Reveal as="ul" className="mt-8 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <li key={m.id} data-reveal className="border-b border-r border-line">
              <TransitionLink href={`/docs/api/${m.id}`} className="group flex h-full flex-col gap-3 p-5 transition-colors duration-150 hover:bg-surface">
                <span className="flex items-center justify-between">
                  <Icon name={moduleIcon[m.id]} size={20} className="text-blue transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                  <span className="micro tabular-nums text-mute">{String(m.methods.length).padStart(2, "0")} methods</span>
                </span>
                <span className="font-mono text-sm">{m.prop ? `client.${m.prop}` : "JKT48Client"}</span>
                <span className="text-sm text-mute">{m.summary}</span>
                <span className="micro mt-auto flex items-center gap-1 text-ink opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  Reference <Icon name="arrowRight" size={11} />
                </span>
              </TransitionLink>
            </li>
          ))}
        </Reveal>
      </section>

      {/* contoh cepat */}
      <section className="mt-section grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]" aria-label="Contoh cepat">
        <div>
          <Headline as="h2" lead="Tiga baris" rest="ke data pertama." className="text-[28px] leading-tight md:text-[40px]" />
          <p className="mt-4 max-w-md text-mute">
            Buat client dengan API key, panggil method. Semua method async dan mengembalikan JSON dari API apa adanya.
          </p>
          <TransitionLink href="/client" className="btn btn-light mt-6">
            Tur client <Icon name="chevronRight" size={12} />
          </TransitionLink>
        </div>
        <CodeBlock
          title="index.mjs"
          tabs={[
            { label: "ESM", lang: "js", code: quick },
            { label: "CJS", lang: "js", code: quick.replace('import JKT48Client from "@jkt48/core";', 'const JKT48Client = require("@jkt48/core");').replace("const live = await client.live.getLive();", "client.live.getLive().then(console.log);") },
          ]}
        />
      </section>
    </div>
  );
}
