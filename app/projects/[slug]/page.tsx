import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { AsciiDivider } from "@/components/ui/AsciiDivider";
import { Reveal } from "@/components/ui/Reveal";
import { Scramble } from "@/components/ui/Scramble";
import { PixelIcon } from "@/components/pixel/PixelIcon";
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

const ACCENT = { pink: "text-pink", mint: "text-mint", lemon: "text-lemon", peach: "text-peach" } as const;

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <article aria-labelledby="project-title" className="pb-section">
      <header className="gutter pt-28 md:pt-36">
        <TransitionLink href="/projects" className="inline-flex items-center gap-2 text-xs text-mute hover:text-lemon" data-cursor="BACK">
          <PixelIcon name="arrow" size={12} className="rotate-180" /> semua proyek
        </TransitionLink>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="min-w-0">
            <p className={`font-display text-sm ${ACCENT[p.accent]}`}>
              #{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </p>
            <h1 id="project-title" className="wrap-any mt-3 font-display text-[clamp(2rem,7vw,5.5rem)] leading-[0.92]">
              <Scramble text={p.name} trigger="mount" duration={1} />
            </h1>
            <p className="mt-6 max-w-2xl text-paper/85 md:text-lg">{p.tagline}</p>
          </div>
          <dl className="px-border grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-3 bg-panel p-5 text-sm">
            <dt className="label">peran</dt>
            <dd>{p.role}</dd>
            <dt className="label">tahun</dt>
            <dd>{p.year ?? "— (belum terverifikasi)"}</dd>
            <dt className="label">kategori</dt>
            <dd className="flex flex-wrap gap-1">
              {p.categories.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </dd>
          </dl>
        </div>
      </header>

      <div className="gutter mt-section grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal as="section" className="space-y-5">
          <AsciiDivider index="01" label="problem" />
          <p data-reveal className="font-display text-xl font-semibold leading-snug md:text-3xl">
            {p.problem}
          </p>
        </Reveal>

        <Reveal as="section" className="space-y-5">
          <AsciiDivider index="02" label="solusi" />
          <ol className="space-y-4">
            {p.solution.map((s, k) => (
              <li key={k} data-reveal className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2">
                <span className={`font-display text-sm ${ACCENT[p.accent]}`}>{String(k + 1).padStart(2, "0")}</span>
                <span className="text-paper/90">{s}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      {p.diagram && (
        <section aria-label="Diagram alur" className="mt-section bg-stage py-16">
          <div className="gutter">
            <AsciiDivider index="03" label="alur sistem" />
            <div className="mt-8 overflow-x-auto">
              <pre className="w-max text-[0.7rem] leading-[1.45] text-mint sm:text-sm" role="img" aria-label={`Diagram ASCII alur sistem ${p.name}`}>
                {p.diagram}
              </pre>
            </div>
          </div>
        </section>
      )}

      <div className="gutter mt-section grid gap-16 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
        <Reveal as="section" className="space-y-5 lg:col-span-2">
          <AsciiDivider index="04" label="tantangan teknis" />
          <ul className="space-y-4">
            {p.challenges.map((c, k) => (
              <li key={k} data-reveal className="flex gap-3 border-l-4 border-line pl-4 text-paper/90">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal as="section" className="space-y-5">
          <AsciiDivider index="05" label="stack" />
          <ul className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} data-reveal className="chip">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal as="section" className="gutter mt-section space-y-5">
        <AsciiDivider index="06" label="bukti yang bisa dicek" />
        <ul className="grid gap-3 md:grid-cols-2">
          {p.proof.map((pr) => (
            <li key={pr.label} data-reveal className="flex items-start justify-between gap-4 bg-stage p-4 text-sm">
              {pr.href ? (
                <a href={pr.href} target="_blank" rel="noreferrer" className="underline decoration-pink decoration-2 underline-offset-4 hover:text-pink" data-cursor="LINK">
                  {pr.label}
                  <span className="sr-only"> (tab baru)</span>
                </a>
              ) : (
                <span className="text-mute">{pr.label}</span>
              )}
              <span className={`shrink-0 font-mono text-[0.6rem] uppercase tracking-widest ${pr.kind === "publik" ? "text-mint" : "text-peach"}`}>
                {pr.kind === "publik" ? "publik" : "belum publik"}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <nav aria-label="Proyek lain" className="gutter mt-section grid gap-3 sm:grid-cols-2">
        <TransitionLink href={`/projects/${prev.slug}`} className="group bg-stage p-5 hover:bg-panel" data-cursor="PREV">
          <span className="label">← sebelumnya</span>
          <span className="mt-2 block font-display text-lg group-hover:text-lemon">{prev.name}</span>
        </TransitionLink>
        <TransitionLink href={`/projects/${next.slug}`} className="group bg-stage p-5 text-right hover:bg-panel" data-cursor="NEXT">
          <span className="label">berikutnya →</span>
          <span className="mt-2 block font-display text-lg group-hover:text-lemon">{next.name}</span>
        </TransitionLink>
      </nav>
    </article>
  );
}
