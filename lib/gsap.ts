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

/**
 * Animasi dimatikan hanya lewat tombol situs (`html[data-motion="off"]`, diset
 * script <head> dari localStorage). Setting OS "reduce motion" sengaja tidak
 * dipakai sebagai saklar: di banyak desktop Windows setting itu aktif tanpa
 * disadari dan membuat situs terlihat mati. Mengubah pilihan → reload.
 */
export function isReduced(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.motion === "off";
}
export const REDUCED = isReduced() ? "all" : "not all";
export const MOTION_OK = isReduced() ? "not all" : "all";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
