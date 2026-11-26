/**
 * Bar gelap bersudut miring dengan dua bilah petir "//" di kiri — motif bawah
 * referensi. Isi bebas lewat children. Bilah disembunyikan di layar sempit.
 */
export function SlashBar({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "footer";
}) {
  return (
    <Tag className={`relative flex items-end ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 300 120"
        className="hidden h-auto w-[22%] shrink-0 md:block"
        preserveAspectRatio="xMinYMax meet"
      >
        <path d="M0 58h62l26-40h20L86 70h22l-44 46 8-34H40l10-24H0z" fill="var(--c-bar)" />
        <path d="M128 58h62l26-40h20l-22 52h22l-44 46 8-34h-32l10-24h-50z" fill="var(--c-bar)" />
      </svg>
      <div className="relative min-w-0 flex-1 md:ml-12">
        {/* ujung kiri miring (desktop) */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-12 -translate-x-[calc(100%-1px)] bg-bar md:block"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 70% 0)" }}
        />
        <div className="rounded-card bg-bar text-on-bar md:rounded-l-none">{children}</div>
      </div>
    </Tag>
  );
}
