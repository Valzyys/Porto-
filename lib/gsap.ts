"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

// Daftarkan plugin sekali di sisi client. Modul ini hanya diimpor oleh
// client component, jadi aman dari SSR.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
  gsap.config({ nullTargetWarn: false });
}

export { gsap, ScrollTrigger, Flip, useGSAP };

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
