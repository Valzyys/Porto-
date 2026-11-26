import type { Block } from "@/content/docs";
import { docs, sections, docHref } from "@/content/docs";
import { modules, callOf, anchorOf } from "@/content/api";
import { pkg, releases } from "@/content/pkg";
import { Md } from "@/lib/md";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { InstallBox } from "@/components/ui/InstallBox";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { LayerDiagram } from "@/components/art/LayerDiagram";
import { ReleaseChart } from "@/components/client/ReleaseChart";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { MethodCard } from "./MethodCard";
import { verbClass } from "@/components/modules/verbs";

const calloutStyle = {
  info: { box: "border-blue/40 bg-blue-soft/50", icon: "info" as const, ic: "text-blue" },
  warn: { box: "border-orange/50 bg-orange-soft/50", icon: "alert" as const, ic: "text-orange" },
  danger: { box: "border-red/50 bg-red/5", icon: "shield" as const, ic: "text-red" },
};

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-sm">
        {head.some(Boolean) && (
          <thead>
            <tr className="border-b border-line">
              {head.map((h, i) => (
                <th key={i} scope="col" className="micro pb-2 pr-4 font-medium text-mute">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line align-top">
              {r.map((c, k) => (
                <td key={k} className={`py-2.5 pr-4 ${k === 0 ? "font-medium" : "text-ink/85"}`}>
                  <Md text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Reference() {
  return (
    <div className="mt-4">
      {sections.map((sec) => (
        <Reveal key={sec} className="mb-8">
          <p data-reveal className="micro mb-2 text-mute">
            {sec}
          </p>
          <ul className="border-t border-line">
            {docs
              .filter((d) => d.section === sec)
              .map((d) => (
                <li key={d.slug} data-reveal className="border-b border-line">
                  <TransitionLink href={docHref(d)} className="group grid gap-1 py-3.5 transition-colors duration-150 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6">
                    <span className="font-medium group-hover:text-blue">{d.title}</span>
                    <span className="text-sm text-mute">{d.description}</span>
                  </TransitionLink>
                </li>
              ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

function Endpoints() {
  return (
    <div className="space-y-10">
      {modules.map((m) => (
        <Reveal as="section" key={m.id}>
          <h2 id={m.id} data-reveal className="scroll-mt-24 text-xl font-medium">
            {m.title} <span className="font-mono text-sm text-mute">{m.prop ? `client.${m.prop}` : "JKT48Client"}</span>
          </h2>
          <div data-reveal className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  {["Method", "Verb", "Path", "Kirim"].map((h) => (
                    <th key={h} scope="col" className="micro pb-2 pr-4 font-medium text-mute">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {m.methods.map((x) => {
                  const local = x.path === "—";
                  return (
                    <tr key={x.name} className="border-b border-line">
                      <td className="py-2.5 pr-4 font-mono text-[13px]">
                        <TransitionLink href={`/docs/api/${m.id}#${anchorOf(x)}`} className="hover:text-blue">
                          {callOf(m, x).replace("client.", "")}()
                        </TransitionLink>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={`micro border px-1.5 py-0.5 ${verbClass[local ? "local" : x.verb]}`}>{local ? "local" : x.verb}</span>
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-[13px]">{x.path}</td>
                      <td className="py-2.5 pr-4 font-mono text-[12px] text-mute">{x.sends ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      ))}
      <p className="text-sm text-mute">
        <Md text={`Semua path relatif terhadap \`${pkg.baseUrl}\`. Query \`apikey\` (dan priority token / kredensial admin bila ada) ditempel otomatis.`} />
      </p>
    </div>
  );
}

function Versions() {
  return (
    <>
      <div className="my-6 border border-line p-5">
        <ReleaseChart />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              {["Versi", "Tanggal (UTC)", "Status"].map((h) => (
                <th key={h} scope="col" className="micro pb-2 pr-4 font-medium text-mute">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...releases].reverse().map((r) => (
              <tr key={r.version} className="border-b border-line">
                <td className="py-2.5 pr-4 font-mono text-[13px]">
                  {r.version}
                  {r.version === pkg.version && <span className="micro ml-2 bg-blue px-1.5 py-0.5 text-white">latest</span>}
                </td>
                <td className="py-2.5 pr-4 tabular-nums">{r.date}</td>
                <td className="py-2.5 pr-4">
                  {r.available ? <span className="text-green">tersedia</span> : <span className="text-mute">tercatat, tidak tersedia (unpublished)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-mute">
        <Md text="Sumber: `npm view @jkt48/core time`. Lompatan 1.2.5 → 7.6.7 memang begitu di registry." />
      </p>
    </>
  );
}

/** Render daftar blok konten docs. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="my-4 text-[15px] leading-7 text-ink/85">
                <Md text={b.text} />
              </p>
            );
          case "h2":
            return (
              <h2 key={i} id={b.id} className="mt-12 scroll-mt-24 border-t border-line pt-8 text-[24px] font-medium tracking-[-0.02em]">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="mt-8 scroll-mt-24 text-lg font-medium">
                {b.text}
              </h3>
            );
          case "code":
            return <CodeBlock key={i} title={b.title} tabs={b.tabs} />;
          case "callout": {
            const st = calloutStyle[b.tone];
            return (
              <div key={i} className={`my-5 flex gap-3 border p-4 ${st.box}`}>
                <Icon name={st.icon} size={17} className={`mt-0.5 shrink-0 ${st.ic}`} />
                <div className="text-sm">
                  <p className="font-medium">{b.title}</p>
                  <p className="mt-1 text-ink/80">
                    <Md text={b.text} />
                  </p>
                </div>
              </div>
            );
          }
          case "list":
            return (
              <ul key={i} className="my-4 space-y-2 text-[15px]">
                {b.items.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-blue" />
                    <span className="text-ink/85">
                      <Md text={t} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <Reveal as="ol" key={i} className="my-6 border-l border-line">
                {b.items.map((s, k) => (
                  <li key={s.title} data-reveal className="relative pb-6 pl-8 last:pb-0">
                    <span className="micro absolute -left-3 top-0 grid h-6 w-6 place-items-center bg-button text-on-button">{k + 1}</span>
                    <p className="font-medium">{s.title}</p>
                    <p className="mt-1 text-sm text-ink/80">
                      <Md text={s.text} />
                    </p>
                  </li>
                ))}
              </Reveal>
            );
          case "table":
            return <Table key={i} head={b.head} rows={b.rows} />;
          case "install":
            return (
              <div key={i} className="my-6 border border-line bg-sunken/50 p-4 md:p-6">
                <p className="mb-3 text-lg font-medium">Install</p>
                <InstallBox />
                <p className="micro mt-3 text-mute">
                  Lalu lanjut ke{" "}
                  <TransitionLink href="/docs/quickstart" className="text-ink underline underline-offset-4">
                    Quickstart →
                  </TransitionLink>
                </p>
              </div>
            );
          case "diagram":
            return (
              <div key={i} className="my-10">
                <LayerDiagram />
              </div>
            );
          case "reference":
            return <Reference key={i} />;
          case "api": {
            const m = modules.find((x) => x.id === b.moduleId)!;
            return (
              <Reveal key={i} className="mt-6 space-y-10">
                <div data-reveal className="flex flex-wrap items-center gap-3 border border-line bg-sunken/50 px-4 py-3 text-sm">
                  <Icon name="code" size={15} className="text-blue" />
                  <span className="font-mono">{m.prop ? `client.${m.prop}` : "new JKT48Client(config)"}</span>
                  <span className="text-mute">· class {m.className}</span>
                  <span className="micro ml-auto text-mute">{m.methods.length} methods</span>
                </div>
                {m.id === "client" && (
                  <div data-reveal>
                    <h3 id="constructor" className="scroll-mt-24 font-mono text-[19px] font-medium">
                      constructor
                    </h3>
                    <p className="mt-3 text-[15px] text-ink/85">
                      <Md text={'`new JKT48Client(config)` — `config.apiKey` wajib; tanpa itu konstruktor melempar `Error("API key is required")`. Opsi lain: `priorityToken`, `adminCredentials`.'} />
                    </p>
                    <CodeBlock tabs={[{ label: "Example", lang: "js", code: `import JKT48Client from "@jkt48/core";\n\nconst client = new JKT48Client({\n  apiKey: "YOUR_API_KEY",\n  priorityToken: "P-ABCD1234", // opsional\n});` }]} />
                  </div>
                )}
                {m.methods.map((x) => (
                  <MethodCard key={x.name} module={m} method={x} />
                ))}
              </Reveal>
            );
          }
          case "endpoints":
            return <Endpoints key={i} />;
          case "versions":
            return <Versions key={i} />;
          case "faq":
            return (
              <div key={i} className="mt-6">
                <Accordion items={b.items} />
              </div>
            );
        }
      })}
    </>
  );
}
