import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SectionHead } from "@/components/ui/SectionHead";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Projects",
  description: "Studi kasus proyek Valzyy: JKT48Connect, live streaming & HLS proxy, payment gateway, bot, Harukaze48, Cavallery, dan aplikasi mobile.",
};

export default function ProjectsPage() {
  const total = String(projects.length).padStart(2, "0");
  return (
    <>
      <PageHero status="Indexing projects…" banner={total} bannerLabel={`Ilustrasi di dalam angka ${total}, jumlah proyek`} tone="orange" />
      <section aria-labelledby="projects-title" className="page-wrap pt-section">
        <SectionHead
          as="h1"
          id="projects-title"
          title="Projects"
          badge={`03 / 05 · ${total} ITEM`}
          meta="Kebanyakan modul ekosistem JKT48Connect. Tanpa angka pengguna — belum ada data publik yang bisa dicek."
        />
        <div className="mt-8">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </>
  );
}
