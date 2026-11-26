"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { Md } from "@/lib/md";
import { Icon } from "@/components/ui/Icon";

function Item({ q, a, open, onToggle, id }: { q: string; a: string; open: boolean; onToggle: () => void; id: string }) {
  const body = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = body.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0, duration: reduced ? 0 : motion.dur.base, ease: motion.ease.out });
    },
    { dependencies: [open] },
  );

  return (
    <div className="border-b border-line">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] hover:text-blue">
          {q}
          <Icon name={open ? "minus" : "plus"} size={16} className={open ? "text-blue" : "text-mute"} />
        </button>
      </h3>
      <div id={id} ref={body} className="h-0 overflow-hidden opacity-0" role="region">
        <p className="max-w-xl pb-5 text-mute">
          <Md text={a} />
        </p>
      </div>
    </div>
  );
}

/** FAQ: satu item terbuka sekaligus, buka/tutup dianimasikan tingginya. */
export function Accordion({ items, initial = 0 }: { items: { q: string; a: string }[]; initial?: number }) {
  const [open, setOpen] = useState(initial);
  return (
    <div className="border-t border-line">
      {items.map((it, i) => (
        <Item key={it.q} id={`faq-${i}`} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
      ))}
    </div>
  );
}
