import type { Metadata } from "next";
import { ModuleBrowser } from "@/components/modules/ModuleBrowser";

export const metadata: Metadata = {
  title: "Modules",
  description: "Semua method @jkt48/core per modul — cari, filter per HTTP verb, dan langsung lompat ke referensinya.",
};

export default function ModulesPage() {
  return (
    <div className="page-wrap">
      <h1 className="sr-only">Modules</h1>
      <ModuleBrowser />
    </div>
  );
}
