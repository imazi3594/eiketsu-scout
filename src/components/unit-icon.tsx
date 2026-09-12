import type { ReactNode } from "react";
import type { UnitName } from "@/data/catalog";
import { cn } from "@/lib/utils";

const GLYPH: Record<UnitName, ReactNode> = {
  騎兵: (
    <path d="M15.2 3.4 13.6.6l-1.15 2.7L11.1.9l-.85 3C5.8 5.3 2.9 8.8 3.5 13.3c.4 2.5 2.5 3.8 4.4 3.4.7-.15 1.35-.6 1.8-1.25.2.95.4 1.9.9 2.9 1.15 2.35 3.35 4.4 7.45 5.15l1.35-2.7c-2.9-.5-4.45-1.95-5.25-3.65-.85-1.8-.45-3.35.55-4.3 1.7-1.55 3.45-3.35 4-5.7.35-1.4-.25-2.9-1.5-3.75-.8-.55-1.7-.95-1.8-1.1z" />
  ),
  槍兵: (
    <>
      <path d="M12 1.1 16.1 8.4l-1.7.45L13.3 22.8h-2.55L9.7 8.85 8 8.4 12 1.1z" />
      <path d="M9.85 8.55C7.2 11.2 6.55 14.4 8.4 16.6 6 13.7 6.85 10.6 9.85 8.55z" />
      <path d="M13.85 8.85c.15 2.85-1.15 5.55-2.85 7.15 2.25-1.75 3.45-4.5 2.85-7.15z" />
    </>
  ),
  弓兵: (
    <>
      <path
        d="M12.4 2.2c-5.4 3.6-6.2 13.2.2 19.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.15"
        strokeLinecap="round"
      />
      <path d="M14.15 2.35h1.2v19.3h-1.2z" />
      <path d="M14.2 1.15 16.7 5.35 14.2 4.45 11.7 5.35z" />
      <path d="M13.55 17.35h1.35l-1.7 2.05zm2.15 0 1.55 2.05-1.55.15z" />
    </>
  ),
  剣豪: (
    <>
      <path d="M10.35 8.55c4.85 5.05 8.7 11.05 9.5 14.8l-2.85.75C16.3 20.6 12.7 15.1 8.35 10.55z" />
      <circle cx="9.85" cy="7.55" r="2.65" />
      <path d="M8.7 6.05 5.15 1.7c-.7-.8-1.95-.55-2.25.5l3.4 5.15z" />
    </>
  ),
  鉄砲隊: (
    <>
      <path d="M9.6 10.05h12.55v2.7H9.6z" />
      <path d="M9.6 10.05 2.95 8.55 1.7 16.85l3.45-1.45 2.55-2.2 1.9.15z" />
      <path d="M11.05 7.85 14.1 5.55l.95 2.05-1.55 2.05H11.05z" />
    </>
  ),
};

export function UnitIcon({
  unit,
  className,
  title,
}: {
  unit: UnitName;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {GLYPH[unit]}
    </svg>
  );
}
