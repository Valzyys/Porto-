import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { AsciiDivider } from "@/components/ui/AsciiDivider";
import { Scramble } from "@/components/ui/Scramble";

export const metadata: Metadata = {
  title: "Projects",
  description: "Studi kasus proyek Valzyy: JKT48Connect, live streaming & HLS proxy, payment gateway, bot, Harukaze48, Cavallery, dan aplikasi mobile.",
};

export default function ProjectsPage() {
  return (
    <section aria-labelledby="projects-title" className="gutter pb-section pt-28 md:pt-36">
      {/* header: angka besar di kanan, judul di kiri */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label">03 / projects</p>
          <h1 id="projects-title" className="mt-4 font-display text-[clamp(2.6rem,10vw,8.5rem)] leading-[0.88]">
            <Scramble text="PROYEK" trigger="mount" />
          </h1>
        </div>
        <p aria-hidden="true" className="font-display text-[clamp(4rem,14vw,11rem)] leading-none text-stage [-webkit-text-stroke:2px_var(--c-line)]">
          {String(projects.length).padStart(2, "0")}
        </p>
      </div>
      <p className="mt-6 max-w-2xl text-paper/85">
        Kebanyakan bagian dari ekosistem JKT48Connect, dipecah per modul supaya jelas apa yang dikerjakan di tiap bagian. Tidak
        ada angka pengguna di sini — belum ada data publik yang bisa dicek.
      </p>
      <AsciiDivider label="index" index="//" className="my-10" />
      <ProjectGrid projects={projects} />
    </section>
  );
}
