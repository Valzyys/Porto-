import type { Metadata } from "next";
import { modules } from "@/content/api";
import { pkg } from "@/content/pkg";
import { faq } from "@/content/docs";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Md } from "@/lib/md";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { moduleIcon } from "@/components/site/moduleIcons";

export const metadata: Metadata = {
  title: "Access",
  description: "API key, priority token, dan kredensial admin di @jkt48/core: apa yang wajib, ke mana dikirim, dan modul mana yang memakainya.",
};

const keyModules = modules.filter((m) => m.prop && m.id !== "admin");

const matrix: { label: string; cells: [string, string, string] }[] = [
  { label: "Wajib", cells: ["ya — konstruktor melempar error tanpa ini", "tidak", "hanya untuk modul Admin"] },
  { label: "Query string", cells: ["`apikey`", "`priority_token`", "`username`, `password`"] },
  { label: "Header", cells: ["—", "`x-priority-token`", "—"] },
  { label: "Body POST/PUT", cells: ["—", "`priority_token`", "—"] },
  { label: "Opsi konstruktor", cells: ["`apiKey`", "`priorityToken`", "`adminCredentials`"] },
  { label: "Setter", cells: ["`setApiKey()`", "`setPriorityToken()`", "`setAdminCredentials()`"] },
  { label: "Dipakai oleh", cells: ["semua request", "semua request (jika diisi)", "semua request (jika diisi)*"] },
];

export default function AccessPage() {
  return (
    <div className="page-wrap pt-14 md:pt-20">
      <h1 className="text-[44px] font-medium tracking-[-0.03em] md:text-[56px]">Access</h1>

      <div className="mt-8 border-b border-line">
        <p className="micro -mb-px inline-block border-b-2 border-blue pb-3 text-mute md:w-1/2">Required for every call</p>
      </div>

      <Reveal className="grid md:grid-cols-2">
        <section data-reveal className="flex flex-col border-b border-line py-8 md:border-r md:pr-8">
          <p className="micro flex items-center gap-2 text-mute">
            <Icon name="key" size={14} className="text-blue" /> API key
          </p>
          <p className="mt-5 font-pixel text-[52px] leading-none text-blue">KEY</p>
          <p className="mt-2 text-sm text-mute">satu per client</p>
          <p className="text-xs text-mute">dikirim di setiap request</p>
          <ul className="mt-6 space-y-2.5 text-[15px]">
            {keyModules.map((m) => (
              <li key={m.id} className="flex items-center gap-2.5">
                <Icon name={moduleIcon[m.id]} size={15} className="text-mute" />
                <TransitionLink href={`/docs/api/${m.id}`} className="underline decoration-line decoration-dashed underline-offset-4 hover:decoration-ink">
                  {m.title}
                </TransitionLink>
                <span className="text-mute">— {m.methods.length} method</span>
              </li>
            ))}
            {["Query `apikey` ditempel otomatis", "Ganti kapan saja dengan `setApiKey()`", "Cek validitasnya dengan `client.check()`"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 bg-blue" />
                <span>
                  <Md text={t} />
                </span>
              </li>
            ))}
          </ul>
          <a href={pkg.links.apiDocs} target="_blank" rel="noreferrer" className="btn mt-8 w-full justify-center bg-blue text-white hover:bg-ink">
            <Icon name="key" size={13} /> Get an API key <Icon name="arrowUpRight" size={11} />
          </a>
        </section>

        <section data-reveal className="flex flex-col border-b border-line py-8 md:pl-8">
          <p className="micro flex items-center gap-2 text-mute">
            <Icon name="shield" size={14} className="text-orange" /> Admin credentials
          </p>
          <p className="mt-5 text-[40px] font-medium leading-none tracking-[-0.02em]">Restricted</p>
          <p className="mt-2 text-sm text-mute">username + password</p>
          <p className="text-xs text-mute">hanya untuk pengelola API</p>
          <ul className="mt-6 space-y-2.5 text-[15px]">
            {modules
              .find((m) => m.id === "admin")!
              .methods.slice(0, 4)
              .map((x) => (
                <li key={x.name} className="flex items-center gap-2.5">
                  <Icon name="shield" size={15} className="text-mute" />
                  <TransitionLink href={`/docs/api/admin#${x.name.toLowerCase()}`} className="font-mono text-sm underline decoration-line decoration-dashed underline-offset-4 hover:decoration-ink">
                    admin.{x.name}()
                  </TransitionLink>
                </li>
              ))}
            {["Dikirim sebagai query `username` & `password`", "Pakai hanya di server, instance terpisah", "Pasang dengan `setAdminCredentials()`"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 bg-orange" />
                <span>
                  <Md text={t} />
                </span>
              </li>
            ))}
          </ul>
          <TransitionLink href="/docs/api/admin" className="btn mt-8 w-full justify-center border border-blue text-blue hover:bg-blue hover:text-white">
            <Icon name="shield" size={13} /> Admin reference <Icon name="arrowRight" size={11} />
          </TransitionLink>
        </section>
      </Reveal>

      {/* matriks */}
      <section className="mt-section" aria-labelledby="matrix-title">
        <div className="flex items-center justify-between">
          <h2 id="matrix-title" className="micro text-mute">
            Auth, per request
          </h2>
          <TransitionLink href="/docs/configuration#request" className="micro flex items-center gap-1 hover:text-blue">
            Anatomi request <Icon name="chevronRight" size={12} />
          </TransitionLink>
        </div>
        <p className="mt-3 text-mute">
          <Md text={`Diambil dari kode \`HttpClient\` di paket v${pkg.version}. Base URL tetap: \`${pkg.baseUrl}\``} />
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-t border-line text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="micro w-48 py-4 pr-4 font-medium text-mute" scope="col">
                  Kredensial
                </th>
                {[
                  { t: "API key", s: "apiKey", i: "key" as const },
                  { t: "Priority token", s: "priorityToken", i: "radio" as const },
                  { t: "Admin", s: "adminCredentials", i: "shield" as const },
                ].map((c) => (
                  <th key={c.t} scope="col" className="py-4 pr-4 font-normal">
                    <span className="flex items-center gap-2 font-medium">
                      <Icon name={c.i} size={14} className="text-mute" /> {c.t}
                    </span>
                    <span className="font-mono text-xs text-mute">{c.s}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((r) => (
                <tr key={r.label} className="border-b border-line">
                  <th scope="row" className="micro py-4 pr-4 font-medium text-mute">
                    {r.label}
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={i} className="py-4 pr-4">
                      <Md text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-mute">* Selama terpasang, username dan password admin ikut ditempel ke URL request non-admin juga.</p>
        <p className="text-xs text-mute">
          <Md text="Respons dikembalikan apa adanya (`response.data`); skema per endpoint ada di dokumentasi API resmi." />
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-section grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]" aria-labelledby="faq-title">
        <Accordion items={faq} />
        <div className="lg:text-right">
          <h2 id="faq-title" className="text-[40px] font-medium tracking-[-0.02em]">
            FAQ
          </h2>
          <p className="mt-3 text-mute">
            Ada yang belum terjawab?
            <br />
            Buka issue di{" "}
            <a href={pkg.links.github} target="_blank" rel="noreferrer" className="prose-link text-ink">
              GitHub
            </a>
            , atau baca{" "}
            <TransitionLink href="/docs" className="prose-link text-ink">
              docs lengkapnya
            </TransitionLink>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
