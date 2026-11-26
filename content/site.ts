/** Navigasi & identitas situs docs @jkt48/core. */

import { pkg } from "./pkg";

export const site = {
  name: "@jkt48/core",
  title: "@jkt48/core — JKT48Connect API client",
  description:
    "Dokumentasi lengkap @jkt48/core: client JavaScript resmi JKT48Connect API untuk Node.js, browser, dan React. Instalasi, konfigurasi, dan referensi semua method.",
  /** [TODO] ganti ke domain final */
  url: "https://valzyy-porto.netlify.app",
  maker: "Valzyy",
  org: "JKT48Connect",
  place: "Semarang, Indonesia",
} as const;

export type NavLink = { href: string; label: string; external?: boolean };

/** grup dipisah garis vertikal di topbar */
export const navGroups: NavLink[][] = [
  [
    { href: "/client", label: "Client" },
    { href: "/modules", label: "Modules" },
    { href: "/access", label: "Access" },
  ],
  [
    { href: pkg.links.npm, label: "npm", external: true },
    { href: pkg.links.github, label: "GitHub", external: true },
  ],
  [{ href: "/docs", label: "Docs" }],
];

export const footerCols: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/client", label: "Client" },
      { href: "/modules", label: "Modules" },
      { href: "/access", label: "Access" },
      { href: "/docs", label: "Docs" },
      { href: "/docs/installation", label: "Install" },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/docs/api/client", label: "API reference" },
      { href: "/docs/endpoints", label: "Endpoints" },
      { href: "/docs/versions", label: "Versions" },
      { href: "/docs/faq", label: "FAQ" },
    ],
  },
  {
    title: "Links",
    links: [
      { href: pkg.links.npm, label: "npm", external: true },
      { href: pkg.links.github, label: "GitHub", external: true },
      { href: pkg.links.apiDocs, label: "API docs", external: true },
    ],
  },
];
