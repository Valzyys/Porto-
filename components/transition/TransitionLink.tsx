"use client";

import Link, { type LinkProps } from "next/link";
import { forwardRef } from "react";
import { usePageTransition } from "./TransitionProvider";

type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    href: string;
  };

/**
 * next/link yang memutar transisi tile sebelum pindah halaman.
 * Klik dengan modifier (ctrl/cmd/shift/alt), klik tengah, atau target lain
 * tetap memakai perilaku browser normal.
 */
export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, onClick, target, ...rest },
  ref,
) {
  const { navigate } = usePageTransition();

  return (
    <Link
      ref={ref}
      href={href}
      target={target}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (target && target !== "_self") return;
        if (href.startsWith("http") || href.startsWith("mailto:")) return;
        e.preventDefault();
        // keyboard (Enter) → clientX/Y = 0 → mulai dari tengah
        const origin = e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : null;
        navigate(href, origin);
      }}
      {...rest}
    />
  );
});
