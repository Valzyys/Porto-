import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-wrap grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <DocsSidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
