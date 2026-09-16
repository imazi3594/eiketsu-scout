import type { CSSProperties } from "react";
import type { Card, ColorName, UnitName } from "@/data/catalog";
import { UnitIcon } from "@/components/unit-icon";
import { cn } from "@/lib/utils";

const FACTION: Record<ColorName, string> = {
  蒼: "var(--color-faction-ao)",
  緋: "var(--color-faction-hi)",
  碧: "var(--color-faction-heki)",
  玄: "var(--color-faction-gen)",
  紫: "var(--color-faction-shi)",
  琥: "var(--color-faction-ko)",
  黄: "var(--color-faction-ou)",
};

const UNIT_WASH: Record<UnitName, { angle: string; rotate: string }> = {
  騎兵: { angle: "100deg", rotate: "-12deg" },
  槍兵: { angle: "42deg", rotate: "28deg" },
  弓兵: { angle: "50deg", rotate: "36deg" },
  剣豪: { angle: "-38deg", rotate: "-22deg" },
  鉄砲隊: { angle: "8deg", rotate: "4deg" },
};

export function CardThemeBackdrop({ card }: { card: Card }) {
  const color = FACTION[card.color];
  const { angle, rotate } = UNIT_WASH[card.unit];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(90% 70% at 0% 0%, color-mix(in srgb, ${color} 52%, transparent), transparent 60%)`,
            `radial-gradient(80% 60% at 100% 100%, color-mix(in srgb, ${color} 30%, transparent), transparent 58%)`,
            `linear-gradient(${angle}, color-mix(in srgb, ${color} 34%, transparent) 0%, transparent 48%, color-mix(in srgb, ${color} 18%, transparent) 100%)`,
          ].join(","),
        }}
      />
      <UnitIcon
        unit={card.unit}
        className="absolute -right-8 -bottom-6 size-[min(16rem,70vw)] opacity-[0.18] lg:-right-10 lg:size-[24rem] lg:opacity-[0.22]"
        style={{ color, transform: `rotate(${rotate})` } satisfies CSSProperties}
      />
    </div>
  );
}

export function HomeWash({ faded = false }: { faded?: boolean }) {
  const src = `${import.meta.env.BASE_URL}home-wash.jpg`;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt=""
        className={cn("absolute inset-0 size-full object-cover object-center", faded ? "opacity-40" : "opacity-100")}
      />
      <div className={cn("absolute inset-0", faded ? "bg-bg/55" : "bg-gradient-to-b from-black/30 via-transparent to-black/50")} />
    </div>
  );
}
