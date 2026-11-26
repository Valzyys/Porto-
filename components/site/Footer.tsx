import { pkg } from "@/content/pkg";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Headline } from "@/components/ui/Headline";
import { CopyButton } from "@/components/ui/CopyButton";
import { Icon } from "@/components/ui/Icon";
import { PixelArt } from "@/components/art/PixelArt";
import { FooterManifest } from "./footer/FooterManifest";
import { PixelWordmark } from "./footer/PixelWordmark";
import { StatusBar } from "./footer/StatusBar";

const CMD = `npm i ${pkg.name}`;

/**
 * Footer "end of file": pernyataan + perintah install di kiri, sitemap sebagai
 * `footer.json` di kanan, wordmark pixel raksasa yang bisa didorong kursor,
 * lalu bar status ala editor kode.
 */
export function Footer() {
  return (
    <footer className="mt-section border-t border-line bg-sunken/60">
      <div className="page-wrap grid grid-cols-[minmax(0,1fr)] gap-12 pb-10 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div className="flex flex-col">
          <p className="micro text-mute">
            <span className="text-blue">{"//"}</span> end of file · terima kasih sudah membaca
          </p>
          <Headline as="h2" lead="Satu client" rest="semua data JKT48Connect." className="mt-6 text-[32px] leading-[1.1] md:text-[48px]" />
          <p className="mt-4 max-w-md text-mute">
            {pkg.description}. Versi {pkg.version}, lisensi {pkg.license}.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="flex h-10 items-center gap-2 border border-line bg-surface pl-3 pr-1 font-mono text-[13px]">
              <span className="text-mute">$</span> {CMD}
              <CopyButton value={CMD} label="Salin perintah install" />
            </span>
            <TransitionLink href="/docs/quickstart" className="btn btn-dark h-10">
              Quickstart <Icon name="chevronRight" size={12} />
            </TransitionLink>
          </div>
          <div className="mt-12 hidden max-w-[17rem] lg:mt-auto lg:block lg:pt-12">
            <PixelArt name="hexagon" label="Ilustrasi pixel heksagon" seed={7} />
          </div>
        </div>
        <FooterManifest />
      </div>

      <div className="page-wrap pb-8">
        <p aria-hidden="true" className="micro mb-3 flex justify-between text-mute">
          <span>
            <span className="text-blue">{"//"}</span> <span className="hidden sm:inline">dorong dengan kursor · </span>klik/tap untuk meledakkan
          </span>
          <span className="hidden sm:inline">5×7 bitmap · {pkg.name}</span>
        </p>
        <PixelWordmark />
      </div>

      <StatusBar />
    </footer>
  );
}
