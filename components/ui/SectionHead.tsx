/**
 * Kepala section ala referensi: "Judul //" tebal, badge biru kecil,
 * garis hitam pendek, dan meta uppercase di kanan.
 */
export function SectionHead({
  title,
  badge,
  meta,
  id,
  action,
  as: Tag = "h2",
}: {
  title: string;
  badge?: string;
  meta?: string;
  id?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-hair pb-5">
      <div className="min-w-0">
        {badge && (
          <span className="mb-3 inline-block rounded-xs bg-blue px-1.5 py-0.5 text-[0.6875rem] font-bold tabular-nums text-on-blue">
            {badge}
          </span>
        )}
        <Tag id={id} className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[0.95] tracking-tight">
          {title} <span className="text-mute">{"//"}</span>
        </Tag>
      </div>
      <div className="flex items-end gap-6">
        {meta && <p className="micro max-w-[16rem] text-right text-mute">{meta}</p>}
        {action}
      </div>
    </div>
  );
}
