/**
 * Ilustrasi vektor orisinal (bukan karakter/aset siapa pun): panggung dengan
 * lampu sorot, penlight, bintang, dan halftone. Dipakai di dalam MaskedBanner.
 * Koordinat dalam viewBox 1200×460. Grup `data-depth` dipakai untuk parallax.
 */

type Props = {
  uid: string;
  /** warna dasar & warna sorot bertukar untuk variasi antar halaman */
  tone: "blue" | "orange";
};

const STAR = "M0 -26 6 -6 26 0 6 6 0 26 -6 6 -26 0 -6 -6Z";

export function StageArt({ uid, tone }: Props) {
  const base = tone === "blue" ? "var(--c-blue)" : "var(--c-orange)";
  const beam = "var(--c-peach)";
  const shade = tone === "blue" ? "var(--c-orange)" : "var(--c-blue)";
  const dots = tone === "blue" ? "#0b2a8f" : "#b86a10";
  const line = "var(--c-line)";
  const id = (s: string) => `${uid}-${s}`;

  return (
    <>
      <defs>
        <pattern id={id("dots")} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="2.1" fill={dots} />
        </pattern>
        <pattern id={id("dots-warm")} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <circle cx="4" cy="4" r="1.7" fill={shade} />
        </pattern>
        <radialGradient id={id("fade")} cx="0.15" cy="0.95" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={id("fade-mask")}>
          <rect width="1200" height="460" fill={`url(#${id("fade")})`} />
        </mask>
        <clipPath id={id("beam1")}>
          <polygon points="930,-40 1070,-40 780,500 430,500" />
        </clipPath>
      </defs>

      {/* dasar + halftone */}
      <rect width="1200" height="460" fill={base} />
      <g data-depth="0.01">
        <rect width="1200" height="460" fill={`url(#${id("dots")})`} mask={`url(#${id("fade-mask")})`} />
      </g>

      {/* lantai panggung: cincin */}
      <g data-depth="0.02" fill="none" stroke={line} strokeWidth="2.5">
        <ellipse cx="260" cy="430" rx="230" ry="70" />
        <ellipse cx="260" cy="430" rx="150" ry="44" opacity="0.6" />
        <path d="M60 300h120M60 316h80M60 332h40" strokeLinecap="round" />
      </g>

      {/* lampu sorot */}
      <g data-depth="0.035">
        <polygon points="120,-40 230,-40 430,500 240,500" fill={beam} stroke={line} strokeWidth="3" strokeLinejoin="round" />
        <polygon points="190,-40 230,-40 430,500 350,500" fill={shade} opacity="0.85" />
        <polygon points="930,-40 1070,-40 780,500 430,500" fill={beam} stroke={line} strokeWidth="3" strokeLinejoin="round" />
        <g clipPath={`url(#${id("beam1")})`}>
          <polygon points="1010,-40 1070,-40 780,500 620,500" fill={shade} />
          <rect x="400" y="-40" width="700" height="560" fill={`url(#${id("dots-warm")})`} opacity="0.55" />
        </g>
      </g>

      {/* penlight */}
      <g data-depth="0.06">
        <g transform="rotate(-24 640 250)">
          <ellipse cx="760" cy="250" rx="300" ry="78" fill={shade} opacity="0.28" />
          <rect x="300" y="222" width="220" height="58" rx="16" fill={beam} stroke={line} strokeWidth="3" />
          <rect x="340" y="222" width="16" height="58" fill={shade} />
          <rect x="372" y="222" width="16" height="58" fill={shade} />
          <rect x="404" y="222" width="16" height="58" fill={shade} />
          <rect x="512" y="212" width="470" height="78" rx="39" fill="#ffffff" stroke={line} strokeWidth="3" />
          <rect x="540" y="230" width="410" height="42" rx="21" fill="var(--c-blue-soft)" />
          <rect x="540" y="230" width="410" height="42" rx="21" fill={`url(#${id("dots-warm")})`} opacity="0.6" />
          <path d="M560 242h300" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          <circle cx="300" cy="251" r="18" fill={line} />
        </g>
      </g>

      {/* bintang & garis kecepatan */}
      <g data-depth="0.09">
        <g fill="#ffffff" stroke={line} strokeWidth="2.5" strokeLinejoin="round">
          <path d={STAR} transform="translate(1080 120) scale(1.3)" />
          <path d={STAR} transform="translate(560 90) scale(0.8)" />
          <path d={STAR} transform="translate(180 170) scale(0.65)" />
          <path d={STAR} transform="translate(960 380) scale(0.55)" />
        </g>
        <g stroke={line} strokeWidth="3" strokeLinecap="round">
          <path d="M1120 260l50-18M1110 290l64-22M1128 318l40-14" />
          <path d="M80 80l40 26M70 112l56 34" />
        </g>
      </g>
    </>
  );
}
