"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

const fmt = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: site.location.timezone,
});

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
}

/** Jam lokal Semarang (WIB). Di server tampil placeholder → tanpa hydration mismatch. */
export function Clock({ withZone = true }: { withZone?: boolean }) {
  const time = useSyncExternalStore(
    subscribe,
    () => fmt.format(Math.floor(Date.now() / 1000) * 1000).replace(/\./g, ":"),
    () => "--:--:--",
  );
  return (
    <time suppressHydrationWarning>
      {time}
      {withZone ? ` ${site.location.tzLabel}` : ""}
    </time>
  );
}
