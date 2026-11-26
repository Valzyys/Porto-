/**
 * Penyorot sintaks kecil untuk contoh kode di docs (JS/JSX/HTML/bash).
 * Sengaja sederhana — cukup untuk kode contoh, tanpa library berat.
 * Menghasilkan token { t: kelas, v: teks }; kelas dipetakan ke .tk-* di CSS.
 */

export type Token = { t: "" | "k" | "s" | "c" | "n" | "f" | "t"; v: string };

const KEYWORDS = new Set([
  "import", "from", "export", "default", "const", "let", "var", "function", "return", "await", "async",
  "new", "if", "else", "try", "catch", "throw", "class", "extends", "true", "false", "null", "undefined",
  "declare", "module", "typeof", "of", "in", "for",
]);

const JS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(<\/?[A-Za-z][\w.-]*)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

export function highlight(code: string, lang: string): Token[] {
  if (lang === "bash" || lang === "text") {
    if (lang === "text") return [{ t: "", v: code }];
    // bash: sorot nama perintah pertama per baris & komentar
    return code.split(/(\n)/).flatMap<Token>((line) => {
      if (line === "\n") return [{ t: "", v: line }];
      if (line.trim().startsWith("#")) return [{ t: "c", v: line }];
      const m = line.match(/^(\s*)(\S+)(.*)$/);
      return m ? [{ t: "", v: m[1] }, { t: "f", v: m[2] }, { t: "", v: m[3] }] : [{ t: "", v: line }];
    });
  }
  const out: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(JS)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: "", v: code.slice(last, i) });
    if (m[1]) out.push({ t: "c", v: m[0] });
    else if (m[2]) out.push({ t: "s", v: m[0] });
    else if (m[3]) out.push({ t: "n", v: m[0] });
    else if (m[4]) out.push({ t: "t", v: m[0] });
    else if (m[5]) out.push({ t: KEYWORDS.has(m[5]) ? "k" : "f", v: m[0] });
    else if (m[6]) out.push({ t: KEYWORDS.has(m[6]) ? "k" : "", v: m[0] });
    last = i + m[0].length;
  }
  if (last < code.length) out.push({ t: "", v: code.slice(last) });
  return out;
}
