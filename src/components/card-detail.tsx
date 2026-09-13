import { ExternalLink } from "lucide-react";
import {
  displayArea,
  displayCats,
  displayEffects,
  displayStratDesc,
  formatStratDuration,
  kokouTiers,
  konshinTiers,
  officialUrl,
  type Card,
  type KokouTiers,
  type KonshinTier,
  type StatLine,
} from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { CardIdentity } from "@/components/card-identity";
import { cn } from "@/lib/utils";

export function CardDetail({ card }: { card: Card }) {
  const duration = formatStratDuration(card);
  const konshin = konshinTiers(card);
  const kokou = konshin ? null : kokouTiers(card);
  const effects = konshin || kokou ? [] : displayEffects(card);
  const area = displayArea(card);
  const cats = displayCats(card);
  const meta = [duration.seconds, duration.dep, duration.extra].filter(Boolean);

  return (
    <div className="flex flex-col gap-4 pb-8">
      <CardIdentity card={card} />

      <section className="rounded-lg border border-white/10 bg-surface/55 p-4 backdrop-blur-[2px]">
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
            <StatStack id={tier.id} rows={tier.rows} />
          </section>
        ))}
      </div>
    </div>
  );
}

function KokouGrid({ data }: { data: KokouTiers }) {
  const labels: string[] = [];
  const seen = new Set<string>();
  for (const col of data.cols) {
    for (const row of col.rows) {
      if (!seen.has(row.label)) {
        seen.add(row.label);
        labels.push(row.label);
      }
    }
  }

  const footnotes: { title: string; rows: StatLine[] }[] = [];
  const compactLabels = labels.filter((label) => {
    const values = data.cols.map((col) => col.rows.filter((r) => r.label === label).map((r) => r.value).join("／"));
    const long = values.some((v) => v.length > 22);
    const onlyLast = values.slice(0, -1).every((v) => !v) && values[values.length - 1];
    if (long && onlyLast) {
      const last = data.cols[data.cols.length - 1];
      footnotes.push({
        title: last.title,
        rows: last.rows.filter((r) => r.label === label),
      });
      return false;
    }
    return true;
  });

  return (
    <div className="mt-4">
      <p className="text-xs leading-relaxed text-pretty text-muted">{data.note}</p>
      {data.shared.length ? (
        <div className="mt-2 rounded-md bg-surface-2 px-2 py-1.5">
          <p className="text-xs text-faint">各劍共通</p>
          <StatStack id="shared" rows={data.shared} />
        </div>
      ) : null}
      {data.extra ? (
        <div className="mt-2 rounded-md bg-surface-2 px-2 py-1.5">
          <p className="text-xs text-faint">{data.extra.title}</p>
          <StatStack id="extra" rows={data.extra.rows} />
        </div>
      ) : null}

      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-0 table-fixed border-separate border-spacing-0 text-center">
          <thead>
            <tr>
              <th className="w-10 px-0.5 pb-1 text-left text-[10px] font-normal text-faint">劍</th>
              {data.cols.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-0.5 pb-1 text-[10px] font-medium",
                    col.highlight ? "rounded-t-md bg-faction-ko/30 text-fg" : "text-muted",
                  )}
                >
                  <span className="block">{col.title.replace("劍", "")}</span>
                  <SwordPips n={col.swords} compact />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compactLabels.map((label) => (
              <tr key={label}>
                <th className="px-0.5 py-1 text-left text-[10px] font-normal leading-tight text-faint">{label}</th>
                {data.cols.map((col) => {
                  const value = col.rows
                    .filter((r) => r.label === label)
                    .map((r) => r.value)
                    .join("／");
                  return (
                    <td
                      key={`${col.id}-${label}`}
                      className={cn(
                        "px-0.5 py-1 text-[11px] leading-snug tabular-nums text-fg",
                        col.highlight && "bg-faction-ko/30",
                      )}
                    >
                      {value || <span className="text-faint">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnotes.map((note, i) => (
        <div key={`${note.title}-${i}`} className="mt-2 rounded-md bg-faction-ko/20 px-2 py-1.5">
          <p className="text-xs text-faint">{note.title}追加</p>
          <StatStack id={`fn-${i}`} rows={note.rows} />
        </div>
      ))}
    </div>
  );
}

function SwordPips({ n, compact }: { n: number | null; compact?: boolean }) {
  if (n == null) return compact ? null : <p className="mt-0.5 text-xs text-faint">所持</p>;
  if (n <= 0) return compact ? <span className="text-[9px] font-normal text-faint">不食</span> : <p className="mt-0.5 text-xs text-faint">不食</p>;
  return (
    <span
      className={cn(
        "flex flex-wrap justify-center gap-px text-faction-ko",
        compact ? "mt-0.5 text-[8px] leading-none" : "mt-0.5 text-[10px] leading-none",
      )}
      aria-hidden
    >
      {Array.from({ length: n }, (_, i) => (
        <span key={i}>◆</span>
      ))}
    </span>
  );
}


function StatStack({ id, rows }: { id: string; rows: StatLine[] }) {
  if (!rows.length) return <p className="mt-2 text-xs text-faint">—</p>;
  return (
    <dl className="mt-2 flex flex-col gap-2">
      {rows.map((row) => (
        <div key={`${id}-${row.label}-${row.value}`} className="min-w-0">
          <dt className="text-xs leading-tight text-faint">{row.label}</dt>
          <dd className="mt-0.5 text-xs leading-snug text-pretty break-words tabular-nums text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
