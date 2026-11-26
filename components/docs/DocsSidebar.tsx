"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { docs, sections, docHref } from "@/content/docs";
import { pkg } from "@/content/pkg";
import { searchStore } from "@/lib/stores";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import { moduleIcon } from "@/components/site/moduleIcons";

const pageIcon: Record<string, IconName> = {
  "": "compass",
  installation: "box",
  quickstart: "terminal",
  configuration: "cpu",
  "priority-token": "key",
  "error-handling": "alert",
  react: "code",
  browser: "layers",
  endpoints: "list",
  versions: "hash",
  faq: "info",
};

function SidebarBody() {
  const pathname = usePathname();
  return (
    <div className="space-y-7">
      <button
        type="button"
        onClick={() => searchStore.set(true)}
        className="flex h-9 w-full items-center gap-2 border border-line bg-sunken px-2.5 text-sm text-mute transition-colors duration-150 hover:border-strong"
      >
        <Icon name="search" size={14} /> Search
        <kbd className="micro ml-auto">⌘K</kbd>
      </button>
      <ul className="space-y-1 text-sm">
        {[
          { href: pkg.links.npm, label: "npm", icon: "box" as const },
          { href: pkg.links.github, label: "GitHub", icon: "code" as const },
          { href: pkg.links.apiDocs, label: "API docs", icon: "book" as const },
        ].map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-1 py-1 text-mute hover:text-ink">
              <Icon name={l.icon} size={14} /> {l.label}
              <span className="sr-only">(tab baru)</span>
            </a>
          </li>
        ))}
      </ul>
      {sections.map((sec) => (
        <div key={sec}>
          <p className="micro px-1 text-mute">{sec}</p>
          <ul className="mt-2 space-y-0.5">
            {docs
              .filter((d) => d.section === sec)
              .map((d) => {
                const href = docHref(d);
                const active = pathname === href;
                const icon = d.slug.startsWith("api/") ? moduleIcon[d.slug.slice(4)] : pageIcon[d.slug] ?? "book";
                return (
                  <li key={d.slug}>
                    <TransitionLink
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-2.5 px-2 py-1.5 text-sm transition-colors duration-150 ${active ? "bg-sunken text-ink" : "text-mute hover:text-ink"}`}
                    >
                      {active && <span aria-hidden="true" className="absolute inset-y-1 left-0 w-0.5 bg-blue" />}
                      <Icon name={icon} size={14} className={active ? "text-blue" : undefined} />
                      {d.title}
                    </TransitionLink>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Sidebar docs: sticky di desktop, disclosure di mobile. */
export function DocsSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside
        className="hidden border-r border-line pr-5 pt-8 lg:sticky lg:top-bar lg:block lg:h-[calc(100svh-var(--s-bar))] lg:overflow-y-auto lg:pb-10"
        data-lenis-prevent
        aria-label="Navigasi docs"
      >
        <p className="mb-5 px-1 text-lg font-medium">Docs</p>
        <SidebarBody />
      </aside>
      <div className="border-b border-line py-3 lg:hidden">
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="micro flex w-full items-center justify-between py-1">
          Docs menu <Icon name="chevronDown" size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="pb-4 pt-3" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
            <SidebarBody />
          </div>
        )}
      </div>
    </>
  );
}
