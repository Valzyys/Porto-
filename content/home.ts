/**
 * Isi blok "spec sheet" & chat di beranda. Semua angka berasal dari fakta
 * situs (lihat content/site.ts, projects.ts, stack.ts) — bukan angka karangan.
 */

import { site } from "./site";
import { projects } from "./projects";
import { stack } from "./stack";

const techCount = stack.filter((g) => g.id !== "lab").flatMap((g) => g.items).length;

export const spec = {
  nameLine: `${site.name} //`,
  roleIndex: "FS",
  role: "Full-stack Developer",
  stat: { value: String(site.since), unit: "*", lines: ["Founder", site.founderOf, "solo developer"] },
  serial: "// 001",
  /** "Developer yang membangun infrastruktur untuk fans." */
  jp: ["ファンのためのインフラを", "つくる開発者。エッジで動く", "API とボットが得意。"],
  jpCaption: "developer yang membangun infrastruktur untuk fans",
  badge: "SMG.ID",
  handle: site.handle.toUpperCase(),
  status: { title: "Status", lines: [`${new Date().getFullYear()} // Portfolio v1`] },
  coord: { title: "Base", value: `${site.location.lat} / ${site.location.lon}` },
  wip: { title: "Work In Progress", lines: ["selalu ada worker", "yang lagi di-deploy"] },
  mark: "2K26",
  marks: ["ID", "JT"],
  power: { title: "EDGE", sub: "WORKERS | HONO | KV" },
  since: { label: "SINCE [ IN YEARS ]", value: `${site.since} → NOW` },
  base: { label: `BASE | ${site.location.city}`, value: `of ${site.location.province}` },
} as const;

export type ChatMessage = { from: "visitor" | "valzyy" | "system"; text: string };

/** Obrolan dekoratif — gaya UI chat game, isinya ringan & tidak mengklaim apa pun. */
export const chat: ChatMessage[] = [
  { from: "visitor", text: "Udah cek JKT48Connect hari ini?" },
  { from: "valzyy", text: "Barusan deploy worker baru." },
  { from: "visitor", text: "Oh!" },
  { from: "visitor", text: "…" },
  { from: "visitor", text: "Pakai apa?" },
  { from: "valzyy", text: "Hono + KV. Kayak biasa." },
  { from: "system", text: "— lanjut ngobrol di /contact —" },
];

export const statBar = {
  count: { label: "Proyek", value: String(projects.length).padStart(2, "0"), sub: "Total" },
  type: { label: "Tipe", value: "EDGE", sub: "Runtime" },
  stack: { label: "Stack", value: String(techCount).padStart(2, "0"), sub: "Teknologi" },
  caution: {
    title: "Proceed With Caution",
    body: "Isinya worker, bot, KV, dan terlalu banyak cron. Data proyek ditulis apa adanya — tanpa angka trafik yang belum bisa dicek.",
    foot: "ADDITIONAL BUILD-UP: GSAP · LENIS · OPENNEXT",
  },
} as const;
