/**
 * Ikon garis buatan sendiri (grid 24, stroke 1.75). Tanpa library ikon,
 * tanpa emoji. `label` → ikon bermakna; tanpa label → dekoratif.
 */

const PATHS = {
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor" stroke="none" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" opacity="0.35" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  arrowUpRight: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowLeft: <path d="M20 12H5M11 6l-6 6 6 6" />,
  arrowUp: <path d="M12 20V5M6 11l6-6 6 6" />,
  shrink: <path d="M4 4l6 6M10 5v5H5M20 20l-6-6M14 19v-5h5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />,
  send: <path d="M21 3 10 14M21 3l-6.5 18-4.5-7-7-4.5L21 3Z" />,
  box: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  spark: <path d="M12 2.5 13.8 10.2 21.5 12 13.8 13.8 12 21.5 10.2 13.8 2.5 12 10.2 10.2 12 2.5Z" fill="currentColor" stroke="none" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1" />
    </>
  ),
  square: <rect x="7" y="7" width="10" height="10" fill="currentColor" stroke="none" />,
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
};

export function Icon({ name, size = 18, className, label }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Logo: kotak biru dengan tanda "V" lengkung — dipakai di topbar & intro. */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="4" fill="var(--c-blue)" />
      <path
        d="M11 12c0 9 3.5 15 9 17 5.5-2 9-8 9-17"
        fill="none"
        stroke="var(--c-on-blue)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="12.5" r="3" fill="var(--c-on-blue)" />
    </svg>
  );
}

/** Empat belah ketupat dua warna (dekor referensi) — warna dari token. */
export function Diamonds({ size = 40, className = "" }: { size?: number; className?: string }) {
  const d = (cx: number, cy: number, fill: string) => (
    <path d={`M${cx} ${cy - 9}l9 9-9 9-9-9z`} fill={fill} />
  );
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      {d(20, 10, "var(--c-blue)")}
      {d(10, 20, "var(--c-blue)")}
      {d(30, 20, "var(--c-peach)")}
      {d(20, 30, "var(--c-orange)")}
    </svg>
  );
}
