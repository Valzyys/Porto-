"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { pkg } from "@/content/pkg";

type Step = { code: string; verb?: string; path?: string; query?: string[]; headers?: string[]; note?: string };

/** Urutan demo — URL/query/header dibangun persis seperti HttpClient di paket. */
const STEPS: Step[] = [
  { code: 'import JKT48Client from "@jkt48/core";', note: "memuat dist/index.esm.js" },
  { code: "const client = new JKT48Client({ apiKey, priorityToken });", note: "kredensial disimpan di HttpClient" },
  {
    code: "await client.members.getMembers();",
    verb: "GET",
    path: "/jkt48/members",
    query: ["apikey=••••••", "priority_token=P-••••"],
    headers: ["Content-Type: application/json", "x-priority-token: P-••••"],
  },
  {
    code: 'await client.members.getMemberDetail("Shani");',
    verb: "GET",
    path: "/jkt48/member/Shani",
    query: ["apikey=••••••", "priority_token=P-••••"],
    headers: ["Content-Type: application/json", "x-priority-token: P-••••"],
  },
  {
    code: 'await client.events.getVideoCall("sesi1", "", "Shani");',
    verb: "GET",
    path: "/jkt48/videocall?sesi=sesi1&member=Shani",
    query: ["apikey=••••••", "priority_token=P-••••"],
    headers: ["Content-Type: application/json", "x-priority-token: P-••••"],
    note: "parameter kosong tidak dikirim",
  },
  {
    code: 'await client.live.getChatStreamShowroom("room");',
    verb: "GET",
    path: "/jkt48/chat-stream-sr?room_id=room",
    query: ["apikey=••••••", "priority_token=P-••••"],
    headers: ["Content-Type: application/json", "x-priority-token: P-••••"],
  },
];

/**
 * Panel terminal gelap (gaya demo referensi): kode diketik baris demi baris,
 * panel kanan menampilkan request yang dibangun client untuk baris itu.
 * Bukan respons API sungguhan — hanya anatomi request.
 */
export function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", ref.current);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        lines.forEach((l) => (l.textContent = l.dataset.full ?? ""));
        setStep(STEPS.length - 1);
        return;
      }
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
        paused: true,
        onRepeat: () => lines.forEach((l) => (l.textContent = "")),
      });
      lines.forEach((l, i) => {
        const full = l.dataset.full ?? "";
        const st = { n: 0 };
        tl.call(() => setStep(i));
        tl.to(st, {
          n: full.length,
          duration: full.length * 0.028,
          ease: "none",
          onUpdate: () => {
            l.textContent = full.slice(0, Math.round(st.n));
          },
        });
        tl.to({}, { duration: STEPS[i].verb ? 1.4 : 0.5 });
      });
      lines.forEach((l) => (l.textContent = ""));
      const st = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom top", onEnter: () => void tl.play(), onLeave: () => void tl.pause(), onEnterBack: () => void tl.play() } });
      return () => {
        tl.kill();
        st.kill();
      };
    },
    { scope: ref },
  );

  const cur = step >= 0 ? STEPS[step] : null;
  const req = [...STEPS].slice(0, step + 1).reverse().find((s) => s.verb) ?? null;
  const count = STEPS.slice(0, step + 1).filter((s) => s.verb).length;

  return (
    <div ref={ref} className="grid overflow-hidden border border-strong bg-[#151514] text-[#e9e9e4] md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="min-w-0 border-b border-white/10 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <span className="micro text-[#f08a45]">index.mjs · node</span>
          <span className="micro text-white/40">{pkg.name}@{pkg.version}</span>
        </div>
        <pre className="min-h-72 overflow-x-auto p-4 text-[12.5px] leading-[1.9]">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex gap-3 ${step === i ? "text-white" : "text-white/60"}`}>
              <span className="select-none text-white/30">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span data-line data-full={s.code}>
                  {s.code}
                </span>
                {step === i && <span className="caret ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-[#7090ff]" />}
              </span>
            </div>
          ))}
        </pre>
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2">
          <span className="micro text-white/40">{cur?.note ?? "ready"}</span>
          <span className="micro text-white/40">gateway: {pkg.baseUrl.replace("https://", "")}</span>
        </div>
      </div>

      <div className="min-w-0 p-4 md:p-5">
        <div className="flex items-center justify-between">
          <span className="micro text-white/40">request inspector</span>
          <span className="micro text-white/40">demo · bukan respons asli</span>
        </div>
        <div className="mt-4 border border-white/10 bg-black/30 p-3 font-mono text-[12px]">
          {req ? (
            <>
              <p className="break-all">
                <span className="mr-2 bg-[#7090ff] px-1.5 py-0.5 text-[11px] font-bold text-black">{req.verb}</span>
                <span className="text-white/50">/api</span>
                {req.path}
              </p>
              <p className="micro mt-3 text-white/40">query</p>
              {req.query?.map((q) => (
                <p key={q} className="text-[#5cc48a]">
                  {q}
                </p>
              ))}
              <p className="micro mt-3 text-white/40">headers</p>
              {req.headers?.map((h) => (
                <p key={h} className="text-white/80">
                  {h}
                </p>
              ))}
              <p className="mt-3 text-white/40">← response.data (JSON, apa adanya)</p>
            </>
          ) : (
            <p className="text-white/40">menunggu request pertama…</p>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-px bg-white/10">
          {[
            { k: "requests", v: String(count).padStart(2, "0") },
            { k: "step", v: `${Math.max(0, step + 1)}/${STEPS.length}` },
            { k: "deps", v: "axios" },
          ].map((x) => (
            <div key={x.k} className="bg-[#151514] p-3">
              <p className="micro text-white/40">{x.k}</p>
              <p className="mt-1 font-mono text-xl tabular-nums">{x.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
