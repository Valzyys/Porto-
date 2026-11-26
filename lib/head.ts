// Modul biasa (bukan "use client") supaya bisa dipakai layout di server.

import { THEME_KEY } from "@/design/tokens";

/** Terapkan tema yang pernah dipilih sebelum paint (tanpa kedip). */
export const themeHeadScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/**
 * Beberapa host (mis. Netlify) menyisipkan komentar HTML ke <head>. Node ekstra
 * itu membuat hydration React gagal (#418) lalu me-render ulang <html> dan
 * membuang atribut tema. Hapus komentar & spasi kosong di <head> sebelum hydration.
 */
export const stripHeadComments = `for(var n=document.head.firstChild;n;){var x=n.nextSibling;if(n.nodeType===8||(n.nodeType===3&&!n.textContent.trim()))n.remove();n=x}`;

export const headScript = `${stripHeadComments};document.documentElement.classList.add("js");${themeHeadScript}`;
