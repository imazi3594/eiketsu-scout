import { useState } from "react";
import { COLOR_BAR, thumbUrl, type Card } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function CardFace({
  card,
  className,
  size = "sm",
}: {
  card: Card;
  className?: string;
  size?: "sm" | "md";
}) {
  const [failed, setFailed] = useState(false);
  const dims = size === "sm" ? "h-20 w-12" : "h-44 w-28";

  if (failed) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-md bg-surface-2 outline outline-1 -outline-offset-1 outline-fg/10",
          dims,
          className,
        )}
      >
        <div className={cn("absolute inset-y-0 left-0 w-1", COLOR_BAR[card.color])} />
        <div className="flex h-full flex-col items-center justify-center px-1 text-center">
          <span className="text-xs text-muted">{card.no}</span>
          <span className="font-display text-xs leading-tight text-fg">{card.name}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={thumbUrl(card)}
      alt={`${card.no} ${card.name}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "rounded-md object-cover outline outline-1 -outline-offset-1 outline-fg/10",
        dims,
        className,
      )}
    />
  );
}
