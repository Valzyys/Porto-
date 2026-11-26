import { Icon } from "@/components/ui/Icon";

/** Wordmark pixel "JKT48/CORE" — huruf pertama biru (gaya wordmark referensi). */
export function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className={`flex items-center gap-2 font-pixel leading-none tracking-tight ${size === "lg" ? "text-2xl" : "text-[17px]"}`}>
      <Icon name="box" size={size === "lg" ? 26 : 20} className="text-blue" />
      <span>
        <span className="text-blue">J</span>KT48<span className="text-mute">/</span>CORE
      </span>
    </span>
  );
}
