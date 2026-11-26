import type { Method, Module } from "@/content/api";
import { signatureOf, anchorOf } from "@/content/api";
import { pkg } from "@/content/pkg";
import { Md } from "@/lib/md";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Icon } from "@/components/ui/Icon";
import { verbClass } from "@/components/modules/verbs";

/** Satu method: anchor, verb + path, signature, parameter, return, contoh, catatan. */
export function MethodCard({ module: m, method: x }: { module: Module; method: Method }) {
  const local = x.path === "—";
  const kind = local ? "local" : x.verb;
  return (
    <section id={anchorOf(x)} data-reveal className="scroll-mt-24 border-t border-line pt-8">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-mono text-[19px] font-medium">
          <a href={`#${anchorOf(x)}`} className="group inline-flex items-center gap-2">
            {x.name}
            <Icon name="hash" size={14} className="text-px3 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          </a>
        </h3>
        <span className={`micro border px-1.5 py-0.5 ${verbClass[kind]}`}>{local ? "local" : x.verb}</span>
        {x.auth === "admin" && <span className="micro border border-orange/60 px-1.5 py-0.5 text-orange">Admin</span>}
      </div>
      <p className="mt-3 text-[15px] text-ink/85">
        <Md text={x.description} />
      </p>

      <div className="mt-4 grid gap-px border border-line bg-line text-sm sm:grid-cols-[8rem_minmax(0,1fr)]">
        <span className="micro bg-canvas px-3 py-2.5 text-mute">Signature</span>
        <code className="min-w-0 break-all bg-canvas px-3 py-2.5 font-mono text-[13px]">{signatureOf(m, x)}</code>
        {!local && (
          <>
            <span className="micro bg-canvas px-3 py-2.5 text-mute">Request</span>
            <code className="min-w-0 break-all bg-canvas px-3 py-2.5 font-mono text-[13px]">
              <span className="font-semibold">{x.verb}</span> <span className="text-mute">{pkg.baseUrl.replace("https://", "")}</span>
              {x.path}
              {x.sends && <span className="text-blue">{x.sends.startsWith("?") ? x.sends : ` · ${x.sends}`}</span>}
            </code>
          </>
        )}
        <span className="micro bg-canvas px-3 py-2.5 text-mute">Returns</span>
        <code className="bg-canvas px-3 py-2.5 font-mono text-[13px]">{x.returns}</code>
      </div>

      {x.params.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                {["Parameter", "Tipe", "Wajib", "Keterangan"].map((h) => (
                  <th key={h} scope="col" className="micro pb-2 pr-4 font-medium text-mute">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {x.params.map((p) => (
                <tr key={p.name} className="border-b border-line align-top">
                  <td className="py-2.5 pr-4 font-mono text-[13px]">{p.name}</td>
                  <td className="py-2.5 pr-4 font-mono text-[13px] text-blue">{p.type}</td>
                  <td className="py-2.5 pr-4 text-[13px]">{p.required ? "ya" : <span className="text-mute">tidak{p.default ? ` (${p.default})` : ""}</span>}</td>
                  <td className="py-2.5 pr-4 text-[13px] text-ink/85">
                    <Md text={p.description} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CodeBlock tabs={[{ label: "Example", lang: "js", code: x.example }]} />

      {x.notes?.map((n) => (
        <p key={n} className="-mt-1 mb-2 flex gap-2 text-[13px] text-mute">
          <Icon name="info" size={14} className="mt-0.5 shrink-0 text-blue" />
          <span>
            <Md text={n} />
          </span>
        </p>
      ))}
    </section>
  );
}
