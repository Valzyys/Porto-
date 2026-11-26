import { spec, chat } from "@/content/home";
import { Icon, Diamonds } from "@/components/ui/Icon";
import { ChatLog } from "@/components/ui/ChatLog";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Spec sheet" di bawah banner: 3 kolom data + kolom chat (desktop),
 * menumpuk 1 kolom di mobile. Grid untuk kolom, flex untuk baris di dalamnya.
 */
export function SpecGrid() {
  return (
    <Reveal className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1.1fr] lg:gap-8">
      {/* A — identitas */}
      <div data-reveal className="flex min-w-0 flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold leading-none tracking-tight">{spec.nameLine}</h1>
          <Icon name="shrink" size={16} className="mt-1 text-ink" />
        </div>
        <p className="flex items-center gap-3">
          <span className="grid h-5 min-w-5 place-items-center rounded-xs bg-bar px-1 text-[0.5625rem] font-bold text-on-bar">
            {spec.roleIndex}
          </span>
          <span className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold leading-tight tracking-tight">{spec.role}</span>
        </p>

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <p className="text-4xl font-light leading-none tabular-nums tracking-tight">
              {spec.stat.value}
              <sup className="text-base font-semibold">{spec.stat.unit}</sup>
            </p>
            <ul className="micro pt-1 text-ink/80">
              {spec.stat.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
          <Diamonds size={36} />
        </div>
        <p className="micro -mt-3 text-mute">{spec.serial}</p>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="jp text-[0.9375rem] font-bold leading-snug" lang="ja">
              {spec.jp.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
            <p className="micro mt-2 text-mute">{spec.jpCaption}</p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill border border-line">
            <Icon name="globe" size={18} />
          </span>
        </div>
      </div>

      {/* B — status */}
      <div data-reveal className="flex min-w-0 flex-col gap-5">
        <div>
          <span className="inline-block rounded-xs bg-blue px-1.5 py-0.5 text-[0.6875rem] font-bold text-on-blue">{spec.badge}</span>
          <p className="micro mt-2 text-ink/80">{spec.handle}</p>
        </div>
        <div>
          <p className="text-sm font-bold">{spec.status.title}</p>
          {spec.status.lines.map((l) => (
            <p key={l} className="text-xs tabular-nums text-mute">
              {l}
            </p>
          ))}
        </div>
        <div>
          <p className="text-sm italic">{spec.coord.title}</p>
          <p className="font-mono text-[0.6875rem] tabular-nums text-mute">{spec.coord.value}</p>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold">{spec.wip.title}</p>
            {spec.wip.lines.map((l) => (
              <p key={l} className="text-[0.6875rem] text-mute">
                {l}
              </p>
            ))}
          </div>
          <Icon name="square" size={14} className="blink text-ink" />
        </div>
        <p className="mt-auto flex items-center gap-2">
          <Icon name="gear" size={18} />
          <span className="text-xl font-extrabold tracking-tight">{spec.mark}</span>
          <span className="micro grid grid-cols-1 leading-none text-ink/80">
            {spec.marks.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </span>
        </p>
      </div>

      {/* C — kekuatan */}
      <div data-reveal className="flex min-w-0 flex-col gap-6 lg:items-end lg:text-right">
        <span aria-hidden="true" className="h-0.5 w-2/3 bg-line" />
        <div>
          <p className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold leading-none tracking-tight">{spec.power.title}</p>
          <p className="micro mt-1 text-ink/80">{spec.power.sub}</p>
        </div>
        <div>
          <p className="micro italic text-mute">{spec.since.label}</p>
          <p className="text-xs font-semibold tabular-nums">{spec.since.value}</p>
        </div>
        <div>
          <p className="micro text-mute">{spec.base.label}</p>
          <p className="text-xs font-semibold">{spec.base.value}</p>
        </div>
      </div>

      {/* D — chat */}
      <div data-reveal className="min-w-0">
        <ChatLog
          label="Obrolan dekoratif"
          items={chat.map((m, i) => ({ from: m.from, content: m.text, key: String(i) }))}
        />
      </div>
    </Reveal>
  );
}
