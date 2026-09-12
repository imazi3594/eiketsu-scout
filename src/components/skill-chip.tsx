import { SKILLS, skillById, skillCardFacts, type Card } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function SkillChip({
  id,
  active,
  onClick,
  count,
}: {
  id: number;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}) {
  const skill = SKILLS[id];
  if (!skill) return null;
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-sm border px-2 text-xs tracking-wide",
        active ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-2 text-fg",
        onClick && "hover:border-fg/30",
      )}
    >
      <span className="text-faint">{skill.short}</span>
      {skill.name}
      {count != null && count > 1 ? <span className="tabular-nums text-muted">×{count}</span> : null}
    </Comp>
  );
}

export function SkillList({ ids }: { ids: number[] }) {
  if (!ids.length) return <span className="text-sm text-faint">無特技</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id, i) => (
        <SkillChip key={`${id}-${i}`} id={id} />
      ))}
    </div>
  );
}

export function SkillExplain({ id, card }: { id: number; card?: Card }) {
  const skill = skillById(id);
  const cardFacts = card ? skillCardFacts(card, id) : [];
  const tableFacts = card
    ? skill.facts.filter((row) => !cardFacts.some((c) => c.label === row.label))
    : skill.facts;
  return (
    <article className="rounded-lg bg-surface-2 p-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <h4 className="font-display text-base">{skill.name}</h4>
        <span className="text-xs text-muted">{skill.short}</span>
        {skill.durationC ? (
          <span className="ml-auto text-xs tabular-nums text-fg">{skill.durationC}</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-fg">{skill.detail}</p>
      {cardFacts.length ? (
        <dl className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {cardFacts.map((row) => (
            <div key={`c-${row.label}`} className="flex items-baseline justify-between gap-3 rounded-md bg-surface px-2.5 py-1.5">
              <dt className="shrink-0 text-xs text-faint">{row.label}</dt>
              <dd className="text-right text-xs tabular-nums text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {tableFacts.length ? (
        <dl className={cn("grid grid-cols-1 gap-1.5 sm:grid-cols-2", cardFacts.length ? "mt-1.5" : "mt-3")}>
          {tableFacts.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3 rounded-md bg-bg/50 px-2.5 py-1.5">
              <dt className="shrink-0 text-xs text-faint">{row.label}</dt>
              <dd className="text-right text-xs tabular-nums text-muted">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{skill.playTip}</p>
    </article>
  );
}
