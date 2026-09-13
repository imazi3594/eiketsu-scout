import {
  COLOR_CLASS,
  formatCost,
  type Card,
} from "@/data/catalog";
import { SkillList } from "@/components/skill-chip";
import { UnitIcon } from "@/components/unit-icon";
import { cn } from "@/lib/utils";

export function CostPips({ cost, small, stacked }: { cost: number; small?: boolean; stacked?: boolean }) {
  const full = Math.floor(cost);
  const half = cost - full >= 0.5;
  const pip = small ? "size-1.5" : "size-3";
  const clip = small ? "h-1.5 w-[0.1875rem]" : "h-3 w-1.5";

  if (!stacked) {
    const rowPip = small ? "size-2" : "size-3";
    const rowClip = small ? "h-2 w-1" : "h-3 w-1.5";
    return (
      <span className="inline-flex items-center gap-px" aria-label={`${formatCost(cost)} cost`} role="img">
        {Array.from({ length: full }, (_, i) => (
          <span key={i} className={cn("shrink-0 rounded-full bg-cost", rowPip)} />
        ))}
        {half ? (
          <span className={cn("shrink-0 overflow-hidden", rowClip)}>
            <span className={cn("block rounded-full bg-cost", rowPip)} />
          </span>
        ) : null}
      </span>
    );
  }

  const slots: Array<"full" | "half" | null> = [null, null, null, null];
  for (let i = 0; i < full && i < 4; i++) slots[i] = "full";
  if (half) {
    const idx = slots.findIndex((s) => s === null);
    if (idx >= 0) slots[idx] = "half";
  }

  return (
    <span className="grid grid-cols-2 grid-rows-2 gap-px" aria-label={`${formatCost(cost)} cost`} role="img">
      {slots.map((slot, i) =>
        slot === "full" ? (
          <span key={i} className={cn("rounded-full bg-cost", pip)} />
        ) : slot === "half" ? (
          <span key={i} className={cn("overflow-hidden", clip)}>
            <span className={cn("block rounded-full bg-cost", pip)} />
          </span>
        ) : (
          <span key={i} className={cn("invisible rounded-full", pip)} />
        ),
      )}
    </span>
  );
}

export function CardIdentity({ card, compact }: { card: Card; compact?: boolean }) {
  const NameTag = compact ? "p" : "h2";
  return (
    <div className={cn("min-w-0", !compact && "pr-8")}>
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
        <UnitIcon unit={card.unit} title={card.unit} className={compact ? "size-4" : "size-[1.15rem]"} />
        <span>武 {card.power}</span>
        <span>知 {card.intel}</span>
      </p>
      <div className={cn("mt-1.5", compact && "mt-1")}>
        <SkillList ids={card.skills} compact={compact} />
      </div>
    </div>
  );
}
