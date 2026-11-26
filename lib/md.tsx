import { Fragment } from "react";
import Link from "next/link";

/**
 * Markdown inline minimal untuk teks docs: `kode`, **tebal**, [teks](url).
 * Link internal (diawali "/") memakai next/link; eksternal buka tab baru.
 */
const RE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;

export function Md({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(<Fragment key={k++}>{text.slice(last, i)}</Fragment>);
    const s = m[0];
    if (m[1]) {
      parts.push(
        <code key={k++} className="ic">
          {s.slice(1, -1)}
        </code>,
      );
    } else if (m[2]) {
      parts.push(
        <strong key={k++} className="font-semibold text-ink">
          {s.slice(2, -2)}
        </strong>,
      );
    } else {
      const label = s.slice(1, s.indexOf("]"));
      const href = s.slice(s.indexOf("(") + 1, -1);
      parts.push(
        href.startsWith("/") ? (
          <Link key={k++} href={href} className="prose-link">
            {label}
          </Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noreferrer" className="prose-link">
            {label}
            <span className="sr-only"> (tab baru)</span>
          </a>
        ),
      );
    }
    last = i + s.length;
  }
  if (last < text.length) parts.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}
