import { ProgressCard } from "@/components/ui/ProgressCard";
import { MaskedBanner } from "@/components/art/MaskedBanner";

/** Pembuka standar tiap halaman: kartu progres baca + banner bertopeng. */
export function PageHero({
  status,
  banner,
  bannerLabel,
  tone = "blue",
  mirror = false,
}: {
  status: string;
  banner: string;
  bannerLabel: string;
  tone?: "blue" | "orange";
  mirror?: boolean;
}) {
  return (
    <div className="page-wrap flex flex-col gap-10 pt-4 md:gap-14 md:pt-8">
      <ProgressCard label={status} />
      <MaskedBanner text={banner} label={bannerLabel} tone={tone} mirror={mirror} />
    </div>
  );
}
