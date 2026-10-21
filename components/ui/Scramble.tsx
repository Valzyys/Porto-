"use client";

import { useEffect, useRef } from "react";
import { scrambleTo } from "@/lib/scramble";
import { ScrollTrigger } from "@/lib/gsap";

type Props = {
  text: string;
  className?: string;
  /** kapan scramble jalan */
  trigger?: "mount" | "inview" | "hover";
  /** gate tambahan, mis. menunggu intro selesai */
  ready?: boolean;
  duration?: number;
  delay?: number;
  as?: "span" | "strong" | "em";
};

/**
 * Teks yang diacak ke karakter ASCII lalu terbentuk. Teks asli tetap ada di
 * DOM (SEO/no-JS) dan dibacakan screen reader lewat salinan sr-only.
 */
export function Scramble({ text, className, trigger = "inview", ready = true, duration = 0.9, delay = 0, as: Tag = "span" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancel: (() => void) | undefined;
    let timer: number | undefined;
    const run = () => {
      cancel?.();
      timer = window.setTimeout(() => {
        cancel = scrambleTo(el, text, { duration });
      }, delay * 1000);
    };

    if (trigger === "mount") {
      run();
    } else if (trigger === "inview") {
      const st = ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: run });
      return () => {
        st.kill();
        window.clearTimeout(timer);
        cancel?.();
      };
    } else {
      const host = (el.closest("a,button") as HTMLElement | null) ?? el;
      host.addEventListener("pointerenter", run);
      host.addEventListener("focus", run);
      return () => {
        host.removeEventListener("pointerenter", run);
        host.removeEventListener("focus", run);
        window.clearTimeout(timer);
        cancel?.();
      };
    }
    return () => {
      window.clearTimeout(timer);
      cancel?.();
    };
  }, [text, trigger, ready, duration, delay]);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </Tag>
  );
}
