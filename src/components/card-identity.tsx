import {
  COLOR_BAR,
  COLOR_CLASS,
  formatCost,
  RARITY_CLASS,
  type Card,
  type Rarity,
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
      <span className="inline-flex items-center gap-px" aria-label={`${formatCost(cost)} Cost`} role="img">
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
    <span className="grid grid-cols-2 grid-rows-2 gap-px" aria-label={`${formatCost(cost)} Cost`} role="img">
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

export function RarityMark({ rarity, className }: { rarity: Rarity; className?: string }) {
  return (
    <span className={cn("inline-block font-bold", RARITY_CLASS[rarity], className)}>
      {rarity}
    </span>
  );
}

function CombatStat({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span className="font-display text-2xl font-bold tabular-nums leading-none text-fg">{value}</span>
      <span className="text-xs text-faint">{label}</span>
    </span>
  );
}

export function CardIdentity({ card, compact }: { card: Card; compact?: boolean }) {
  if (compact) {
    return (
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={cn("rounded-sm px-1 py-px font-medium", COLOR_CLASS[card.color])}>{card.no}</span>
          <span className="text-faint">{card.period}</span>
        </p>
        <p className="mt-1 flex min-w-0 items-baseline gap-2 font-bold text-fg">
          <RarityMark rarity={card.rarity} className="shrink-0" />
          <span className="min-w-0 truncate">{card.name}</span>
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs tabular-nums text-muted">
          <CostPips cost={card.cost} />
          <UnitIcon unit={card.unit} title={card.unit} className="size-4" />
          <span>武 {card.power}</span>
          <span>知 {card.intel}</span>
        </p>
        <div className="mt-1">
          <SkillList ids={card.skills} compact />
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-black/35">
      <div className={cn("absolute inset-y-0 left-0 w-1", COLOR_BAR[card.color])} aria-hidden />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 p-3 pl-4">
        <p className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={cn("rounded-sm px-1.5 py-0.5 font-medium", COLOR_CLASS[card.color])}>{card.no}</span>
          <span className="text-faint">{card.period}</span>
        </p>
        <div className="flex items-center justify-end gap-1 text-fg">
          <UnitIcon unit={card.unit} title={card.unit} className="size-5" />
          <span className="text-sm font-medium">{card.unit}</span>
        </div>

        <h2 className="flex min-w-0 items-baseline gap-2 font-display text-2xl font-bold leading-none text-balance text-fg">
          <RarityMark rarity={card.rarity} className="shrink-0" />
          <span className="min-w-0">{card.name}</span>
        </h2>
        <div className="flex items-baseline justify-end gap-3">
          <CombatStat label="武" value={card.power} />
          <CombatStat label="知" value={card.intel} />
        </div>

        <div className="min-w-0">
          <SkillList ids={card.skills} />
        </div>
        <div className="flex justify-end">
          <CostPips cost={card.cost} />
        </div>
      </div>
    </section>
  );
}