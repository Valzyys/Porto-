import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";
import { SlashBar } from "@/components/ui/SlashBar";
import { PageHero } from "@/components/layout/PageHero";
import { TransitionLink } from "@/components/transition/TransitionLink";

// Semua slug di-prerender saat build; slug lain → 404 tanpa beban runtime.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.name, description: p.tagline };
}

function Block({ title, index, children }: { title: string; index: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="flex flex-col gap-4 rounded-card border border-line p-5 md:p-6">
      <div data-reveal className="flex items-center justify-between gap-3 border-b border-hair pb-3">
        <h2 className="text-lg font-extrabold tracking-tight">
          {title} <span className="text-mute">{"//"}</span>
        </h2>
        <span className="micro tabular-nums text-mute">{index}</span>
      </div>
      {children}
    </Reveal>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const num = String(i + 1).padStart(2, "0");
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <article aria-labelledby="project-title">
      <PageHero status={`Opening ${p.name}…`} banner={num} bannerLabel={`Ilustrasi di dalam angka ${num}`} tone={i % 2 ? "orange" : "blue"} mirror={i % 2 === 1} />

      <div className="page-wrap pt-section">
        <TransitionLink href="/projects" className="micro mb-6 inline-flex items-center gap-1.5 text-mute hover:text-ink">
          <Icon name="arrowLeft" size={14} /> Semua proyek
        </TransitionLink>
        <SectionHead as="h1" id="project-title" title={p.name} badge={`M${num} / ${String(projects.length).padStart(2, "0")}`} meta={p.categories.join(" · ")} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <p className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold leading-snug tracking-tight">{p.tagline}</p>
          <dl className="divide-y divide-hair rounded-card border border-line">
            {[
              ["Peran", p.role],
              ["Tahun", p.year ?? "— (belum terverifikasi)"],
              ["Kategori", p.categories.join(", ")],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 px-4 py-2.5">
                <dt className="micro pt-0.5 text-mute">{k}</dt>
                <dd className="text-sm font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Block title="Problem" index="01">
            <p data-reveal className="text-lg font-semibold leading-snug">
              {p.problem}
            </p>
          </Block>
          <Block title="Solusi" index="02">
            <ol className="space-y-3">
              {p.solution.map((s, k) => (
                <li key={k} data-reveal className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 text-sm">
                  <span className="micro rounded-xs bg-blue px-1 py-0.5 text-center tabular-nums text-on-blue">{String(k + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Block>
        </div>

        {p.diagram && (
          <Reveal as="section" className="mt-5 rounded-card border border-line bg-surface p-5 md:p-6">
            <p data-reveal className="micro mb-4 text-mute">
              03 // Alur sistem
            </p>
            <div className="overflow-x-auto">
              <pre data-reveal className="w-max text-[0.6875rem] leading-[1.5] text-blue-ink sm:text-sm" role="img" aria-label={`Diagram alur sistem ${p.name}`}>
                {p.diagram}
              </pre>
            </div>
          </Reveal>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Block title="Tantangan teknis" index="04">
            <ul className="space-y-3">
              {p.challenges.map((c, k) => (
                <li key={k} data-reveal className="flex gap-3 text-sm">
                  <Icon name="spark" size={14} className="mt-0.5 shrink-0 text-orange" />
                  {c}
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Stack" index="05">
            <ul className="flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li key={s} data-reveal className="micro rounded-pill border border-line px-2.5 py-1">
                  {s}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <div className="mt-5">
          <Block title="Bukti yang bisa dicek" index="06">
            <ul className="grid gap-2 md:grid-cols-2">
              {p.proof.map((pr) => (
                <li key={pr.label} data-reveal className="flex items-start justify-between gap-4 rounded-inner bg-surface px-4 py-3 text-sm">
                  {pr.href ? (
                    <a href={pr.href} target="_blank" rel="noreferrer" className="min-w-0 font-semibold underline decoration-blue decoration-2 underline-offset-4 hover:text-blue-ink">
                      {pr.label}
                      <span className="sr-only"> (tab baru)</span>
                    </a>
                  ) : (
                    <span className="min-w-0 text-mute">{pr.label}</span>
                  )}
                  <span className={`micro shrink-0 rounded-xs px-1.5 py-0.5 ${pr.kind === "publik" ? "bg-blue text-on-blue" : "bg-surface-2 text-mute"}`}>
                    {pr.kind === "publik" ? "Publik" : "Belum publik"}
                  </span>
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <nav aria-label="Proyek lain" className="mt-10">
          <SlashBar>
            <div className="grid sm:grid-cols-2">
              <TransitionLink href={`/projects/${prev.slug}`} className="group flex flex-col gap-1 px-5 py-5 hover:bg-on-bar/5 md:px-8">
                <span className="micro flex items-center gap-1 text-on-bar-mute">
                  <Icon name="arrowLeft" size={12} /> Sebelumnya
                </span>
                <span className="text-lg font-extrabold tracking-tight group-hover:text-blue-ink">{prev.name}</span>
              </TransitionLink>
              <TransitionLink
                href={`/projects/${next.slug}`}
                className="group flex flex-col items-end gap-1 border-t border-on-bar/15 px-5 py-5 text-right hover:bg-on-bar/5 sm:border-l sm:border-t-0 md:px-8"
              >
                <span className="micro flex items-center gap-1 text-on-bar-mute">
                  Berikutnya <Icon name="arrowRight" size={12} />
                </span>
                <span className="text-lg font-extrabold tracking-tight group-hover:text-blue-ink">{next.name}</span>
              </TransitionLink>
            </div>
          </SlashBar>
        </nav>
      </div>
    </article>
  );
}
