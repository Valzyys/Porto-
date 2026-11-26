import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { docs, getDoc, docHref } from "@/content/docs";
import { modules, anchorOf } from "@/content/api";
import { pkg } from "@/content/pkg";
import { Md } from "@/lib/md";
import { Blocks } from "@/components/docs/Blocks";
import { Toc, type TocItem } from "@/components/docs/Toc";
import { Headline } from "@/components/ui/Headline";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Icon } from "@/components/ui/Icon";

// Semua halaman docs diprerender saat build; slug lain → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug ? d.slug.split("/") : [] }));
}

async function resolve(params: Promise<{ slug?: string[] }>) {
  const { slug } = await params;
  return getDoc((slug ?? []).join("/"));
}

export async function generateMetadata({ params }: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const d = await resolve(params);
  if (!d) return {};
  return { title: d.slug ? `${d.title} · Docs` : "Docs", description: d.description };
}

function tocOf(slug: string): TocItem[] {
  const d = getDoc(slug)!;
  const items: TocItem[] = [];
  for (const b of d.blocks) {
    if (b.type === "h2" || b.type === "h3") items.push({ id: b.id, text: b.text, depth: b.type === "h2" ? 2 : 3 });
    if (b.type === "api") {
      const m = modules.find((x) => x.id === b.moduleId)!;
      if (m.id === "client") items.push({ id: "constructor", text: "constructor", depth: 2, mono: true });
      m.methods.forEach((x) => items.push({ id: anchorOf(x), text: x.name, depth: 2, mono: true }));
    }
    if (b.type === "endpoints") modules.forEach((m) => items.push({ id: m.id, text: m.title, depth: 2 }));
  }
  return items;
}

export default async function DocPage({ params }: PageProps<"/docs/[[...slug]]">) {
  const d = await resolve(params);
  if (!d) notFound();
  const i = docs.indexOf(d);
  const prev = docs[i - 1];
  const next = docs[i + 1];
  const toc = tocOf(d.slug);

  return (
    <div className="grid gap-10 py-8 lg:pl-10 xl:grid-cols-[minmax(0,1fr)_13rem]">
      <article className="min-w-0 max-w-3xl">
        <p className="micro flex items-center gap-1.5 text-mute">
          <TransitionLink href="/docs" className="hover:text-ink">
            Docs
          </TransitionLink>
          <Icon name="chevronRight" size={11} /> {d.section}
        </p>
        <Headline lead={d.title} rest="" className="mt-3 text-[34px] leading-tight md:text-[44px]" />
        <p className="mt-3 text-[17px] text-mute">
          <Md text={d.description} />
        </p>
        <p className="micro mt-4 flex flex-wrap gap-x-4 gap-y-1 text-mute">
          <span>
            {pkg.name}@{pkg.version}
          </span>
          <span>{pkg.license}</span>
          <a href={pkg.links.github} target="_blank" rel="noreferrer" className="hover:text-ink">
            Source ↗
          </a>
        </p>

        <div className="mt-8">
          <Blocks blocks={d.blocks} />
        </div>

        <nav aria-label="Halaman lain" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <TransitionLink href={docHref(prev)} className="group border border-line p-4 transition-colors duration-150 hover:border-strong">
              <span className="micro flex items-center gap-1 text-mute">
                <Icon name="arrowLeft" size={11} /> Previous
              </span>
              <span className="mt-1 block font-medium group-hover:text-blue">{prev.title}</span>
            </TransitionLink>
          ) : (
            <span />
          )}
          {next && (
            <TransitionLink href={docHref(next)} className="group border border-line p-4 text-right transition-colors duration-150 hover:border-strong">
              <span className="micro flex items-center justify-end gap-1 text-mute">
                Next <Icon name="arrowRight" size={11} />
              </span>
              <span className="mt-1 block font-medium group-hover:text-blue">{next.title}</span>
            </TransitionLink>
          )}
        </nav>
      </article>
      <div className="hidden xl:block">
        <Toc items={toc} />
      </div>
    </div>
  );
}
