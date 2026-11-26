/**
 * Fakta paket @jkt48/core — diambil dari tarball npm v7.7.7 (package.json,
 * README, dist/index.esm.js) dan metadata registry npm. Tidak ada angka karangan.
 */

export const pkg = {
  name: "@jkt48/core",
  version: "7.7.7",
  description: "Official JKT48 Connect API client for Node.js and browsers",
  license: "MIT",
  author: "Valzyy",
  dependency: { name: "axios", range: "^1.6.0" },
  baseUrl: "https://v2.jkt48connect.com/api",
  unpackedSize: "79.8 kB",
  fileCount: 6,
  /** package.json menunjuk dist/index.d.ts, tapi file itu tidak ada di tarball 7.7.7 */
  shipsTypes: false,
  entry: {
    esm: "dist/index.esm.js",
    cjs: "dist/index.cjs",
    umd: "dist/index.umd.js",
    umdGlobal: "JKT48Client",
  },
  links: {
    npm: "https://www.npmjs.com/package/@jkt48/core",
    github: "https://github.com/JKT48Connect/jkt48-core",
    apiDocs: "https://docs.jkt48connect.com",
  },
} as const;

export type InstallTab = { id: string; label: string; cmd: string };

export const installTabs: InstallTab[] = [
  { id: "npm", label: "npm", cmd: "npm install @jkt48/core" },
  { id: "pnpm", label: "pnpm", cmd: "pnpm add @jkt48/core" },
  { id: "yarn", label: "yarn", cmd: "yarn add @jkt48/core" },
  { id: "bun", label: "bun", cmd: "bun add @jkt48/core" },
];

export type Release = { version: string; date: string; available: boolean };

/** Riwayat rilis dari `npm view @jkt48/core time` (tanggal UTC). */
export const releases: Release[] = [
  { version: "1.0.0", date: "2025-05-12", available: true },
  { version: "1.0.1", date: "2025-05-12", available: true },
  { version: "1.0.2", date: "2025-05-19", available: true },
  { version: "1.0.3", date: "2025-05-24", available: false },
  { version: "1.0.4", date: "2025-05-24", available: true },
  { version: "1.0.5", date: "2025-05-24", available: true },
  { version: "1.0.6", date: "2025-05-27", available: true },
  { version: "1.0.7", date: "2025-05-27", available: true },
  { version: "1.0.8", date: "2025-06-11", available: true },
  { version: "1.0.9", date: "2025-06-11", available: true },
  { version: "1.0.10", date: "2025-06-15", available: false },
  { version: "1.1.0", date: "2025-06-15", available: true },
  { version: "1.1.1", date: "2025-06-26", available: true },
  { version: "1.1.2", date: "2025-07-07", available: true },
  { version: "1.1.3", date: "2025-07-10", available: true },
  { version: "1.2.0", date: "2025-08-04", available: true },
  { version: "1.2.1", date: "2025-08-17", available: true },
  { version: "1.2.2", date: "2025-08-17", available: true },
  { version: "1.2.3", date: "2025-08-18", available: true },
  { version: "1.2.4", date: "2025-09-13", available: true },
  { version: "1.2.5", date: "2025-09-13", available: true },
  { version: "7.6.7", date: "2025-11-12", available: true },
  { version: "7.6.8", date: "2025-11-12", available: true },
  { version: "7.6.9", date: "2025-12-10", available: true },
  { version: "7.7.0", date: "2025-12-10", available: true },
  { version: "7.7.1", date: "2025-12-10", available: true },
  { version: "7.7.2", date: "2025-12-10", available: true },
  { version: "7.7.3", date: "2025-12-10", available: true },
  { version: "7.7.7", date: "2025-12-10", available: true },
];
