import type { IconName } from "@/components/ui/Icon";

/** Ikon per modul API (dipakai di beranda, /modules, sidebar). */
export const moduleIcon: Record<string, IconName> = {
  client: "cpu",
  members: "users",
  live: "radio",
  events: "calendar",
  media: "film",
  admin: "shield",
  changelog: "list",
  garden: "sprout",
};
