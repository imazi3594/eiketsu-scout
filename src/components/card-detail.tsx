import { ExternalLink } from "lucide-react";
import {
  cardTanken,
  displayArea,
  displayCats,
  displayEffects,
  displayMainStratDesc,
  formatStratDuration,
  kokouTiers,
  konshinTiers,
  officialUrl,
  type Card,
  type KokouTiers,
  type KonshinTier,
  type StatLine,
  type Tanken,
} from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { CardIdentity } from "@/components/card-identity";
import { cn } from "@/lib/utils";

export function StratTitle({ card }: { card: Card }) {
  const cats = displayCats(card);
  return (
    <div className="min-w-0">
      <p className="font-display text-xl leading-tight text-fg">{card.stratName}</p>
      <p className="mt-0.5 text-xs text-muted">
        {cats.length ? `${cats.join(" · ")} · ` : null}士氣 {card.stratCost}
      </p>
    </div>
  );
}

export function CardDetail({ card }: { card: Card }) {
  const duration = formatStratDuration(card);
  const konshin = konshinTiers(card);
  const kokou = konshin ? null : kokouTiers(card);
  const effects = konshin || kokou ? [] : displayEffects(card);
  const area = displayArea(card);
  const desc = displayMainStratDesc(card);
  const tankens = cardTanken(card);
  const meta = [duration.seconds, duration.dep, duration.extra].filter(Boolean);
  const hasData = Boolean(konshin || kokou || effects.length || area || duration.label);

  return (
    <div className="flex flex-col gap-3 pb-8">
      <CardIdentity card={card} />

      <section className="rounded-lg border border-white/10 bg-black/35 p-4">
        <StratTitle card={card} />
        {desc ? <p className="mt-3 text-sm leading-relaxed text-pretty text-fg">{desc}</p> : null}
      </section>

      {hasData ? (
        <section className="rounded-lg border border-white/10 bg-black/35 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs text-faint">時長</p>
            <p className="font-display text-3xl whitespace-nowrap tabular-nums leading-none text-fg">{duration.label}</p>
          </div>
          {meta.length ? (
            <p className="mt-1.5 text-right text-xs leading-relaxed text-pretty tabular-nums text-muted">
              {meta.join(" · ")}
            </p>
          ) : null}

          {konshin ? (
            <KonshinGrid tiers={konshin} />
          ) : kokou ? (
            <KokouGrid data={kokou} />
          ) : effects.length ? (
            <EffectList rows={effects} />
          ) : null}

          {area ? (
            <p className="mt-3 text-sm text-muted">
              <span className="text-xs text-faint">範圍　</span>
              {area}
            </p>
          ) : null}
        </section>
      ) : null}

      {tankens.map((tanken) => (
        <TankenBox key={tanken.name} tanken={tanken} />
      ))}

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

function TankenBox({ tanken }: { tanken: Tanken }) {
  return (
    <section className="rounded-lg border border-white/10 bg-black/35 p-4">
      <p className="text-xs text-faint">短計</p>
      <p className="mt-1 font-display text-xl leading-tight text-fg">{tanken.name}</p>
      {tanken.cost ? <p className="mt-0.5 text-xs text-muted">士氣 {tanken.cost}</p> : null}
      {tanken.text ? <p className="mt-3 text-sm leading-relaxed text-pretty text-fg">{tanken.text}</p> : null}
      {tanken.rows.length ? <EffectList rows={tanken.rows} /> : null}
    </section>
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
      <div className="mt-2 flex flex-col gap-2">
        {tiers.map((tier) => (
          <section
            key={tier.id}
            className={cn(
              "rounded-md px-2.5 py-2",
              tier.id === "strong" ? "bg-faction-shi/25" : "bg-surface-2",
            )}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3
                className={cn(
                  "font-display text-sm leading-tight",
                  tier.id === "strong" ? "text-fg" : "text-muted",
                )}
              >
                {tier.title}
              </h3>
              <p className="text-xs tabular-nums text-faint">{tier.morale}</p>
            </div>
            <TierRows id={tier.id} rows={tier.rows} />
          </section>
        ))}
      </div>
    </div>
  );
}

function KokouGrid({ data }: { data: KokouTiers }) {
  const cols = [...data.cols].reverse();
  return (
    <div className="mt-4">
      <p className="text-xs leading-relaxed text-pretty text-muted">{data.note}</p>
      {data.shared.length ? (
        <div className="mt-2 rounded-md bg-surface-2 px-2.5 py-2">
          <p className="text-xs text-faint">各劍共通</p>
          <TierRows id="shared" rows={data.shared} />
        </div>
      ) : null}
      {data.extra ? (
        <div className="mt-2 rounded-md bg-surface-2 px-2.5 py-2">
          <p className="text-xs text-faint">{data.extra.title}</p>
          <TierRows id="extra" rows={data.extra.rows} />
        </div>
      ) : null}

      <div className="mt-2 flex flex-col gap-2">
        {cols.map((col) => (
          <section
            key={col.id}
            className={cn("rounded-md px-2.5 py-2", col.highlight ? "bg-faction-ko/30" : "bg-surface-2")}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className={cn("font-display text-sm leading-tight", col.highlight ? "text-fg" : "text-muted")}>
                {col.title}
              </h3>
              <SwordPips n={col.swords} />
            </div>
            <TierRows id={col.id} rows={col.rows} />
          </section>
        ))}
      </div>
    </div>
  );
}

function SwordPips({ n }: { n: number | null }) {
  if (n == null) return <span className="text-xs text-faint">所持</span>;
  if (n <= 0) return <span className="text-xs text-faint">不消耗</span>;
  return (
    <span className="flex flex-wrap justify-end gap-px text-[10px] leading-none text-faction-ko" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <span key={i}>◆</span>
      ))}
    </span>
  );
}

function TierRows({ id, rows }: { id: string; rows: StatLine[] }) {
  if (!rows.length) return <p className="mt-2 text-xs text-faint">—</p>;
  return (
    <dl className="mt-1.5 grid grid-cols-1 gap-1.5">
      {rows.map((row) => (
        <EffectRow key={`${id}-${row.label}-${row.value}`} row={row} />
      ))}
    </dl>
  );
}
