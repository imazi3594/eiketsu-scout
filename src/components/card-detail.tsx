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
  splitEffectValue,
  type Card,
  type KokouTiers,
  type KonshinTier,
  type StatLine,
  type Tanken,
} from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { CardIdentity } from "@/components/card-identity";
import { cn } from "@/lib/utils";

function MoraleCost({ cost }: { cost: number | string }) {
  return (
    <span className="inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap">
      <span className="text-xs text-faint">消耗士氣:</span>
      <span className="font-display text-2xl tabular-nums leading-none text-fg">{cost}</span>
    </span>
  );
}

export function StratTitle({ card }: { card: Card }) {
  const cats = displayCats(card);
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-xl leading-tight text-fg">{card.stratName}</span>
        <MoraleCost cost={card.stratCost} />
      </div>
      {cats.length ? <p className="mt-1 text-xs text-muted">{cats.join(" · ")}</p> : null}
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
      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-xl leading-tight text-fg">{tanken.name}</span>
        {tanken.cost ? <MoraleCost cost={tanken.cost} /> : null}
      </div>
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
  const { note, lines } = splitEffectValue(row.value);
  const listed = note || lines.length > 1;
  if (!listed) {
    return (
      <div className="flex items-baseline justify-between gap-3 rounded-md bg-surface-2 px-2.5 py-1.5">
        <dt className="shrink-0 text-xs text-faint">{row.label}</dt>
        <dd className="text-right text-sm leading-relaxed text-pretty tabular-nums text-fg">{row.value}</dd>
      </div>
    );
  }
  return (
    <div className="rounded-md bg-surface-2 px-2.5 py-1.5">
      <dt className="text-xs text-faint">{row.label}</dt>
      <dd className="mt-1">
        {note ? <p className="mb-0.5 text-xs leading-relaxed text-muted">{note}</p> : null}
        <ul className="space-y-0.5">
          {lines.map((line) => (
            <li key={line} className="text-sm leading-relaxed tabular-nums text-fg">
              <span className="text-faint">· </span>
              {line}
            </li>
          ))}
        </ul>
      </dd>
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
              <h3 className={cn("min-h-4 font-display text-sm leading-tight", col.highlight ? "text-fg" : "text-muted")}>
                {col.swords == null ? (
                  col.title
                ) : col.swords <= 0 ? (
                  "不消耗"
                ) : (
                  <KokouSwords n={col.swords} />
                )}
              </h3>
            </div>
            <TierRows id={col.id} rows={col.rows} />
          </section>
        ))}
      </div>
    </div>
  );
}

function KokouSwords({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`${n}劍`}>
      {Array.from({ length: n }, (_, i) => (
        <KokouSwordMark key={i} />
      ))}
    </span>
  );
}

/** 🗡️-shaped pip, 琥色偏亮。 */
function KokouSwordMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-5 shrink-0 drop-shadow-[0_0_3px_#ffb340]" aria-hidden>
      <g transform="rotate(48 16 16)">
        <path d="M16 1.6 19.4 16.2H12.6Z" fill="#ffc45c" />
        <path d="M16 3.1 16.9 16H15.1Z" fill="#fff6d4" />
        <rect x="8.6" y="15.6" width="14.8" height="2.8" rx="1.1" fill="#ffb340" />
        <rect x="13.7" y="18.2" width="4.6" height="7.4" rx="1.15" fill="#f08c18" />
        <circle cx="16" cy="26.6" r="2.55" fill="#ffc45c" />
        <circle cx="16" cy="26.6" r="1.15" fill="#fff3c4" />
      </g>
    </svg>
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
