"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { featuredProjects, projects } from "@/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Icon } from "@/components/ui/Icon";

/**
 * Proyek unggulan. Desktop (≥1024px): section di-pin dan kartu bergulir
 * horizontal mengikuti scroll. Mobile/tablet & reduced motion: grid biasa.
 */
export function FeaturedProjects() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const track = ref.current?.querySelector<HTMLElement>("[data-track]");
      const bar = ref.current?.querySelector<HTMLElement>("[data-bar]");
      const count = ref.current?.querySelector<HTMLElement>("[data-count]");
      if (!track) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", track);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            pin: true,
            start: "top top",
            end: () => `+=${distance() + 200}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
              if (count) count.textContent = String(Math.min(cards.length, Math.floor(self.progress * cards.length) + 1)).padStart(2, "0");
            },
          },
        });
      });

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.from(cards, {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: track, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="featured-title" className="overflow-hidden py-section lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-16">
      <div className="page-wrap">
        <SectionHead
          id="featured-title"
          title="Projects"
          badge={`${String(featuredProjects.length).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`}
          meta="Proyek unggulan — studi kasus lengkap di tiap kartu"
          action={
            <TransitionLink href="/projects" className="micro flex shrink-0 items-center gap-1 rounded-pill border border-line px-3 py-2 hover:bg-ink hover:text-canvas">
              Semua <Icon name="arrowUpRight" size={12} />
            </TransitionLink>
          }
        />
        <div className="mt-4 hidden items-center gap-3 lg:flex" aria-hidden="true">
          <span className="micro tabular-nums text-mute">
            <span data-count>01</span> / {String(featuredProjects.length).padStart(2, "0")}
          </span>
          <span className="relative h-1 w-40 overflow-hidden rounded-pill bg-surface-2">
            <span data-bar className="absolute inset-0 origin-left bg-blue" style={{ transform: "scaleX(0)" }} />
          </span>
        </div>

        <ol data-track className="mt-8 grid gap-5 sm:grid-cols-2 lg:flex lg:w-full lg:gap-6">
          {featuredProjects.map((p) => (
            <li key={p.slug} data-card className="min-w-0 lg:w-[min(26rem,34vw)] lg:shrink-0">
              <ProjectCard project={p} index={projects.indexOf(p)} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
