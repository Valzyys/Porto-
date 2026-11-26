import { statBar } from "@/content/home";
import { SlashBar } from "@/components/ui/SlashBar";
import { Icon, LogoMark } from "@/components/ui/Icon";
import { Counter } from "@/components/ui/Counter";
import { TransitionLink } from "@/components/transition/TransitionLink";

/** Bar statistik bawah ala referensi (RATING / TYPE / Proceed With Caution). */
export function StatBar() {
  const { count, type, stack, caution } = statBar;
  return (
    <SlashBar as="section">
      <div className="grid gap-6 px-5 py-5 sm:grid-cols-3 md:px-8 lg:grid-cols-[auto_auto_auto_1fr] lg:items-center lg:gap-10">
        <div>
          <p className="micro text-on-bar-mute">{count.label}</p>
          <p className="text-[2.5rem] font-light leading-none tabular-nums">
            <Counter value={Number(count.value)} />
          </p>
          <TransitionLink href="/projects" className="micro mt-1 flex items-center gap-1 text-on-bar hover:text-blue-ink">
            {count.sub} <Icon name="arrowUpRight" size={12} />
          </TransitionLink>
        </div>
        <div>
          <p className="micro text-on-bar-mute">{type.label}</p>
          <p className="text-[2.5rem] font-normal leading-none tracking-tight">{type.value}</p>
          <p className="micro mt-1 flex items-center gap-1.5">
            {type.sub}
            <span className="grid h-3.5 w-3.5 place-items-center rounded-pill bg-blue">
              <span className="h-1.5 w-1.5 rounded-pill bg-on-blue" />
            </span>
          </p>
        </div>
        <div>
          <p className="micro text-on-bar-mute">{stack.label}</p>
          <p className="text-[2.5rem] font-light leading-none tabular-nums">
            <Counter value={Number(stack.value)} />
          </p>
          <TransitionLink href="/stack" className="micro mt-1 flex items-center gap-1 text-on-bar hover:text-blue-ink">
            {stack.sub} <Icon name="arrowUpRight" size={12} />
          </TransitionLink>
        </div>
        <div className="min-w-0 border-t border-on-bar/15 pt-5 sm:col-span-3 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-base font-extrabold tracking-wide">{caution.title}</p>
          <p className="mt-1 max-w-md text-[0.625rem] uppercase leading-snug text-on-bar-mute">{caution.body}</p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="micro text-on-bar">{caution.foot}</p>
            <LogoMark size={20} />
          </div>
        </div>
      </div>
    </SlashBar>
  );
}
