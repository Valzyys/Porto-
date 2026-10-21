// Modul biasa (bukan "use client") supaya bisa dipakai layout di server.

import { THEME_KEY } from "@/design/tokens";

export const INTRO_KEY = "vzy:intro-seen";

/** Script inline untuk <head>: tandai <html> sebelum paint supaya intro
 *  tidak berkedip bagi pengunjung yang sudah melihatnya di sesi ini. */
export const introHeadScript = `try{if(sessionStorage.getItem("${INTRO_KEY}")==="1")document.documentElement.dataset.introSeen="1"}catch(e){}`;

/** Terapkan tema yang pernah dipilih sebelum paint (tanpa kedip). */
export const themeHeadScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
