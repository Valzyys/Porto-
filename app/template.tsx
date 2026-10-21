"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, REDUCED } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { usePageTransition } from "@/components/transition/TransitionProvider";

/**
 * template.tsx di-remount setiap route berubah, jadi efek di sini jalan
 * di setiap navigasi: buka tirai tile + fade konten.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const { enter } = usePageTransition();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      enter(pathname);
      const mm = gsap.matchMedia();
      mm.add(REDUCED, () => {
        gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: motion.dur.base });
      });
      return () => mm.revert();
    },
    // dependencies: pathname → tetap jalan saat template tidak remount
    // (mis. /projects → /projects/[slug], segmen pertama sama)
    { scope: ref, dependencies: [pathname] },
  );

  return (
    <div ref={ref} id="page">
      {children}
    </div>
  );
}
