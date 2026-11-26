"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, Flip, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { modules, callOf, anchorOf, methodCount, type HttpVerb } from "@/content/api";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { moduleIcon } from "@/components/site/moduleIcons";
import { verbClass } from "./verbs";

type Row = { key: string; module: (typeof modules)[number]; method: (typeof modules)[number]["methods"][number]; kind: HttpVerb | "local" };

const ROWS: Row[] = modules.flatMap((m) =>
  m.methods.map((x) => ({ key: `${m.id}.${x.name}`, module: m, method: x, kind: x.path === "—" ? "local" : x.verb })),
);

const KINDS: (HttpVerb | "local")[] = ["GET", "POST", "PUT", "DELETE", "local"];
type Sort = "module" | "az" | "verb";


function SideBtn({ active, onClick, children, count, hot }: { active: boolean; onClick: () => void; children: React.ReactNode; count: number; hot?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap px-2.5 py-2 text-left lg:w-full text-sm transition-colors duration-150 ${
        active ? (hot ? "border border-orange/60 bg-orange-soft" : "border border-transparent bg-sunken") : "border border-transparent hover:bg-sunken/70"
      }`}
    >
      {children}
      <span className="micro tabular-nums text-mute lg:ml-auto">{count}</span>
    </button>
  );
}

/** Hub method (gaya "Cells hub"): sidebar filter + pencarian + daftar baris. */
export function ModuleBrowser() {
  const [mod, setMod] = useState<string>("all");
  const [kind, setKind] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("module");
  const listRef = useRef<HTMLOListElement>(null);
  const flip = useRef<Flip.FlipState | null>(null);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = ROWS.filter(
      (r) =>
        (mod === "all" || r.module.id === mod) &&
        (kind === "all" || r.kind === kind) &&
        (!s || `${r.method.name} ${r.method.path} ${r.method.description} ${r.module.title}`.toLowerCase().includes(s)),
    );
    if (sort === "az") out.sort((a, b) => a.method.name.localeCompare(b.method.name));
    if (sort === "verb") out.sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind));
    return out;
  }, [mod, kind, q, sort]);

  const capture = () => {
    flip.current = Flip.getState(gsap.utils.toArray<HTMLElement>("[data-row]", listRef.current));
  };

  // animasi masuk pertama
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-row]", { autoAlpha: 0, y: 14, duration: motion.dur.base, ease: motion.ease.out, stagger: 0.025 });
    },
    { scope: listRef },
  );

  // Flip setiap filter/urutan berubah
  useGSAP(
    () => {
      const st = flip.current;
      if (!st) return;
      flip.current = null;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      Flip.from(st, {
        duration: motion.dur.base,
        ease: motion.ease.out,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: motion.dur.base, stagger: 0.02 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: motion.dur.fast }),
      });
    },
    { scope: listRef, dependencies: [rows] },
  );

  return (
    <div className="grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="min-w-0 border-line pb-2 lg:sticky lg:pb-8 lg:top-bar lg:h-[calc(100svh-var(--s-bar))] lg:overflow-y-auto lg:border-r lg:pr-5 lg:pt-8" data-lenis-prevent>
        <p className="pt-8 text-xl font-medium lg:pt-0">Modules hub</p>
        <div className="-mx-(--s-gutter) mt-5 flex gap-1 overflow-x-auto px-(--s-gutter) pb-1 lg:mx-0 lg:block lg:space-y-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
          <SideBtn active={mod === "all"} onClick={() => { capture(); setMod("all"); }} count={methodCount}>
            <Icon name="compass" size={15} /> Explore
          </SideBtn>
          {modules.map((m) => (
            <SideBtn key={m.id} active={mod === m.id} onClick={() => { capture(); setMod(m.id); }} count={m.methods.length} hot={m.id === "admin"}>
              <Icon name={moduleIcon[m.id]} size={15} className={m.id === "admin" ? "text-orange" : undefined} /> {m.title}
            </SideBtn>
          ))}
        </div>
        <p className="micro mt-4 text-mute lg:mt-8">Kinds</p>
        <div className="-mx-(--s-gutter) mt-2 flex gap-1 overflow-x-auto px-(--s-gutter) pb-1 lg:mx-0 lg:block lg:space-y-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
          <SideBtn active={kind === "all"} onClick={() => { capture(); setKind("all"); }} count={ROWS.length}>
            <span className="h-2 w-2 bg-blue" /> All
          </SideBtn>
          {KINDS.map((k) => (
            <SideBtn key={k} active={kind === k} onClick={() => { capture(); setKind(k); }} count={ROWS.filter((r) => r.kind === k).length}>
              <span className="h-2 w-2 bg-px3" /> {k === "local" ? "Local (no HTTP)" : k}
            </SideBtn>
          ))}
        </div>
        <div className="mt-8 hidden border-t border-line pt-6 lg:block">
          <TransitionLink href="/docs/endpoints" className="flex items-center gap-1 text-sm hover:text-blue">
            Endpoints table <Icon name="chevronRight" size={13} />
          </TransitionLink>
          <TransitionLink href="/docs" className="btn btn-dark mt-4 w-full justify-between">
            Open docs <Icon name="arrowRight" size={14} />
          </TransitionLink>
        </div>
      </aside>

      <div className="min-w-0 py-8 lg:pl-8">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-11 min-w-0 items-center gap-3 border sm:flex-1 border-line bg-sunken px-3">
            <Icon name="search" size={15} className="text-mute" />
            <span className="sr-only">Cari method</span>
            <input
              value={q}
              onChange={(e) => {
                capture();
                setQ(e.target.value);
              }}
              placeholder="Search by name, path, what it does"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-mute"
            />
          </label>
          <label className="flex h-11 items-center gap-2 border border-line bg-sunken px-3 text-sm">
            <Icon name="sort" size={15} className="text-mute" />
            <span className="sr-only">Urutkan</span>
            <select
              value={sort}
              onChange={(e) => {
                capture();
                setSort(e.target.value as Sort);
              }}
              className="bg-transparent outline-none"
            >
              <option value="module">By module</option>
              <option value="az">A–Z</option>
              <option value="verb">By HTTP verb</option>
            </select>
          </label>
        </div>

        <p className="mt-6 flex items-center gap-3 text-lg">
          All methods
          <span className="micro border border-line px-1.5 py-0.5 tabular-nums">{rows.length}</span>
          <span className="micro text-mute">of {ROWS.length}</span>
        </p>

        <ol ref={listRef} className="mt-4 border-x border-t border-line" aria-live="polite">
          {rows.length === 0 && <li className="border-b border-line px-4 py-10 text-center text-sm text-mute">Tidak ada method yang cocok.</li>}
          {rows.map((r) => {
            const admin = r.method.auth === "admin";
            return (
              <li key={r.key} data-row data-flip-id={r.key} className={`border-b ${admin ? "border-orange/60 bg-orange-soft/40" : "border-line"}`}>
                <TransitionLink
                  href={`/docs/api/${r.module.id}#${anchorOf(r.method)}`}
                  className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors duration-150 hover:bg-surface md:grid-cols-[2.25rem_minmax(0,16rem)_minmax(0,1fr)_auto]"
                >
                  <span className={`grid h-9 w-9 place-items-center border ${admin ? "border-orange/50 text-orange" : "border-line text-blue"}`}>
                    <Icon name={moduleIcon[r.module.id]} size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-sm">{r.method.name}</span>
                    <span className="block truncate text-xs text-mute">
                      {callOf(r.module, r.method).replace(`.${r.method.name}`, "")} · {r.kind === "local" ? "no request" : r.method.path}
                    </span>
                  </span>
                  <span className="col-span-2 min-w-0 text-sm text-ink/85 md:col-span-1">{r.method.description}</span>
                  <span className="col-span-2 flex items-center gap-2 md:col-span-1 md:justify-end">
                    {admin && <span className="micro border border-orange/60 px-1.5 py-0.5 text-orange">Admin</span>}
                    <span className={`micro border px-1.5 py-0.5 ${verbClass[r.kind]}`}>{r.kind === "local" ? "local" : r.kind}</span>
                  </span>
                </TransitionLink>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
