import { ExternalLink } from "lucide-react";
import {
  displayArea,
  displayCats,
  displayEffects,
  displayStratDesc,
  formatStratDuration,
  konshinTiers,
  officialUrl,
  type Card,
  type KonshinTier,
  type StatLine,
} from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { CardIdentity } from "@/components/card-identity";
import { cn } from "@/lib/utils";

export function CardDetail({ card }: { card: Card }) {
  const duration = formatStratDuration(card);
  const tiers = konshinTiers(card);
  const effects = tiers ? [] : displayEffects(card);
  const area = displayArea(card);
  const cats = displayCats(card);
  const meta = [duration.seconds, duration.dep, duration.extra].filter(Boolean);

  return (
    <div className="flex flex-col gap-4 pb-8">
      <CardIdentity card={card} />

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-xl leading-tight">{card.stratName}</p>
            <p className="mt-1 text-xs text-muted">
              {cats.length ? `${cats.join(" · ")} · ` : null}士氣 {card.stratCost}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-3xl whitespace-nowrap tabular-nums leading-none text-fg">{duration.label}</p>
            {meta.length ? (
              <p className="mt-1.5 text-xs leading-relaxed text-pretty tabular-nums text-muted">
                {meta.join(" · ")}
              </p>
            ) : null}
          </div>
        </div>

        {tiers ? <KonshinGrid tiers={tiers} /> : effects.length ? <EffectList rows={effects} /> : null}

        {area ? (
          <p className="mt-3 text-sm text-muted">
            <span className="text-xs text-faint">範圍　</span>
            {area}
          </p>
        ) : null}

        <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">{displayStratDesc(card)}</p>
      </section>

      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <a href={officialUrl(card)} target="_blank" rel="noreferrer">
            <ExternalLink />
            官方
          </a>
        </Button>
        {card.dbUrl ? (
          <Button variant="ghost" asChild>
            <a href={card.dbUrl} target="_blank" rel="noreferrer">
              <ExternalLink />
              數值
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function EffectList({ rows }: { rows: StatLine[] }) {
  return (
    <dl className="mt-4 grid grid-cols-1 gap-1.5">
      {rows.map((row) => (
        <EffectRow key={`${row.label}-${row.value}`} row={row} />
      ))}
    </dl>
  );
}

function EffectRow({ row }: { row: StatLine }) {
  return (
    <div className="flex items-baseline justify-between gap-3 rounded-md bg-surface-2 px-2.5 py-1.5">
      <dt className="shrink-0 text-xs text-faint">{row.label}</dt>
      <dd className="text-right text-sm leading-relaxed text-pretty tabular-nums text-fg">{row.value}</dd>
    </div>
  );
}

function KonshinGrid({ tiers }: { tiers: KonshinTier[] }) {
  return (
    <div className="mt-4">
      <p className="text-xs leading-relaxed text-pretty text-muted">發動時所持士氣愈接近所需，效果愈強。</p>
      <div className="mt-2 grid grid-cols-3 gap-1">
        {tiers.map((tier) => (
          <section
            key={tier.id}
            className={cn(
              "min-w-0 rounded-md px-1.5 py-2",
              tier.id === "strong" ? "bg-faction-shi/25" : "bg-surface-2",
            )}
          >
            <h3
              className={cn(
                "font-display text-xs leading-tight",
                tier.id === "strong" ? "text-fg" : "text-muted",
              )}
            >
              {tier.title}
            </h3>
            <p className="mt-0.5 text-xs tabular-nums text-faint">{tier.morale}</p>
            <dl className="mt-2 flex flex-col gap-2">
              {tier.rows.length ? (
                tier.rows.map((row) => (
                  <div key={`${tier.id}-${row.label}-${row.value}`} className="min-w-0">
                    <dt className="text-xs leading-tight text-faint">{row.label}</dt>
                    <dd className="mt-0.5 text-xs leading-snug text-pretty break-words tabular-nums text-fg">
                      {row.value}
                    </dd>
                  </div>
                ))
              ) : (
                <p className="text-xs text-faint">—</p>
              )}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
