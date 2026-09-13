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

export function HomeWash() {
  const marks: { unit: UnitName; color: string; className: string; rotate: string }[] = [
    { unit: "槍兵", color: "var(--color-faction-ao)", className: "-left-8 top-8 size-40", rotate: "28deg" },
    { unit: "騎兵", color: "var(--color-faction-hi)", className: "right-[-2rem] top-24 size-44", rotate: "-18deg" },
    { unit: "弓兵", color: "var(--color-faction-heki)", className: "left-10 bottom-28 size-36", rotate: "40deg" },
    { unit: "剣豪", color: "var(--color-faction-shi)", className: "right-6 bottom-16 size-40", rotate: "-28deg" },
    { unit: "鉄砲隊", color: "var(--color-faction-ko)", className: "left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2", rotate: "8deg" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(80% 55% at 8% 12%, color-mix(in srgb, var(--color-faction-ao) 32%, transparent), transparent 58%)",
            "radial-gradient(70% 50% at 96% 8%, color-mix(in srgb, var(--color-faction-hi) 26%, transparent), transparent 55%)",
            "radial-gradient(65% 50% at 88% 92%, color-mix(in srgb, var(--color-faction-ko) 24%, transparent), transparent 56%)",
            "radial-gradient(60% 45% at 6% 88%, color-mix(in srgb, var(--color-faction-shi) 22%, transparent), transparent 52%)",
            "radial-gradient(50% 40% at 50% 48%, color-mix(in srgb, var(--color-cost) 12%, transparent), transparent 62%)",
          ].join(","),
        }}
      />
      {marks.map((mark) => (
        <UnitIcon
          key={mark.unit}
          unit={mark.unit}
          className={cn("absolute opacity-[0.14]", mark.className)}
          style={{ color: mark.color, transform: `rotate(${mark.rotate})` }}
        />
      ))}
    </div>
  );
}
