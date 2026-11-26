import type { Metadata } from "next";
import { PixelArt } from "@/components/art/PixelArt";
import { Headline } from "@/components/ui/Headline";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/transition/TransitionLink";

export const metadata: Metadata = { title: "404" };

export default function NotFound() {
  return (
    <div className="page-wrap pt-12 md:pt-14">
      <section className="grid grid-cols-[minmax(0,1fr)] border border-line md:grid-cols-2">
        <div className="flex min-w-0 flex-col justify-center p-6 md:p-10">
          <p className="micro text-mute">Error 404 · not found</p>
          <Headline lead="404" rest="endpoint ini tidak ada di client." className="mt-3 text-[34px] leading-tight md:text-[44px]" />
          <pre className="mt-6 overflow-x-auto border border-line bg-code p-4 text-[13px]">
            <span className="text-mute">{"// "}</span>
            {'throw new Error("API Error (404): Not Found");'}
          </pre>
          <div className="mt-6 flex flex-wrap gap-2">
            <TransitionLink href="/" className="btn btn-dark">
              <Icon name="arrowLeft" size={12} /> Home
            </TransitionLink>
            <TransitionLink href="/docs" className="btn btn-light">
              Docs
            </TransitionLink>
            <TransitionLink href="/modules" className="btn btn-light">
              Modules
            </TransitionLink>
          </div>
        </div>
        <div className="border-t border-line p-8 md:border-l md:border-t-0 md:p-12">
          <PixelArt name="warning" label="Ilustrasi pixel segitiga peringatan" />
        </div>
      </section>
    </div>
  );
}
