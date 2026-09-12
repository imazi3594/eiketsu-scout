import {
  COLOR_CLASS,
  formatCost,
  skillNames,
  UNIT_SHORT,
  type Card,
} from "@/data/catalog";
import { cn } from "@/lib/utils";

export function CostPips({ cost, small }: { cost: number; small?: boolean }) {
  const full = Math.floor(cost);
  const half = cost - full >= 0.5;
  const pip = small ? "size-2" : "size-3";
  const clip = small ? "h-2 w-1" : "h-3 w-1.5";
  return (
    <span className="inline-flex items-center gap-px" aria-label={`${formatCost(cost)} cost`} role="img">
      {Array.from({ length: full }, (_, i) => (
        <span key={i} className={cn("shrink-0 rounded-full bg-cost", pip)} />
      ))}
      {half ? (
        <span className={cn("shrink-0 overflow-hidden", clip)}>
          <span className={cn("block rounded-full bg-cost", pip)} />
        </span>
      ) : null}
    </span>
  );
}

export function CardIdentity({ card, compact }: { card: Card; compact?: boolean }) {
  const NameTag = compact ? "p" : "h2";
  return (
    <div className="min-w-0">
      <p className="flex flex-wrap items-center gap-1.5 text-xs">
        <span
          className={cn(
            "rounded-sm font-medium",
            compact ? "px-1 py-px" : "px-1.5 py-0.5",
            COLOR_CLASS[card.color],
          )}
        >
          {card.no}
        </span>
        <span className="text-muted">{card.rarity}</span>
        <span className="text-faint">{card.period}</span>
      </p>
      <NameTag
        className={cn(
          "mt-1 text-fg",
          compact ? "truncate font-medium" : "font-display text-2xl leading-tight text-balance",
        )}
      >
        {card.name}
      </NameTag>
      <p
        className={cn(
          "mt-1.5 flex flex-wrap items-center gap-2.5 tabular-nums",
          compact ? "text-xs text-muted" : "text-sm text-muted",
        )}
      >
        <CostPips cost={card.cost} />
        <span>{UNIT_SHORT[card.unit]}</span>
        <span>武 {card.power}</span>
        <span>知 {card.intel}</span>
      </p>
      <p className={cn("mt-1", compact ? "truncate text-xs text-fg" : "text-sm text-fg")}>{skillNames(card)}</p>
    </div>
  );
}
