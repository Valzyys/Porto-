/** Divider ASCII: +--[ 02 — LABEL ]-------------------+ (dekoratif). */
export function AsciiDivider({ label, index, className = "" }: { label: string; index?: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex min-w-0 max-w-full select-none items-center gap-2 overflow-hidden whitespace-nowrap text-xs text-line ${className}`}>
      <span>+--[</span>
      <span className="font-mono tracking-widest text-mute">
        {index && <span className="text-pink">{index} </span>}
        {label.toUpperCase()}
      </span>
      <span>]</span>
      {/* absolut → tidak ikut menambah lebar intrinsik (cegah overflow horizontal) */}
      <span className="relative h-[1lh] min-w-0 flex-1">
        <span className="absolute inset-0 overflow-hidden">{"-".repeat(240)}</span>
      </span>
      <span>+</span>
    </div>
  );
}
