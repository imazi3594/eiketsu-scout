import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BookOpen, ChevronDown, ChevronUp, Search, X, Zap } from "lucide-react";
import {
  CARD_BY_ID,
  CARD_COUNT,
  CARDS,
  COLOR_BAR,
  COLOR_CLASS,
  COLOR_INK,
  COLORS,
  COSTS,
  formatCost,
  formatStratDuration,
  PERIODS,
  RARITIES,
  SKILLS,
  UNITS,
  UNIT_SHORT,
  type ColorName,
} from "@/data/catalog";
import { filterCards, searchCards } from "@/lib/search";
import { useScout } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { CardDetail } from "@/components/card-detail";
import { CardThemeBackdrop } from "@/components/card-theme";
import { CardIdentity, CostPips } from "@/components/card-identity";
import { UnitIcon } from "@/components/unit-icon";
import { SkillExplain } from "@/components/skill-chip";
import { cn } from "@/lib/utils";

type Tab = "search" | "skills";

export function ScoutApp() {
  const [tab, setTab] = useState<Tab>("search");
  const [colors, setColors] = useState<ColorName[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [skills, setSkills] = useState<number[]>([]);
  const [rarities, setRarities] = useState<string[]>([]);
  const [costs, setCosts] = useState<number[]>([]);
  const [moreFilters, setMoreFilters] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const query = useScout((s) => s.query);
  const setQuery = useScout((s) => s.setQuery);
  const selectedId = useScout((s) => s.selectedId);
  const select = useScout((s) => s.select);
  const recents = useScout((s) => s.recents);
  const selected = selectedId ? CARD_BY_ID[selectedId] : null;

  useEffect(() => {
    void Promise.resolve(useScout.persist.rehydrate());
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const layerActive = colors.length + costs.length + units.length + periods.length + skills.length + rarities.length;

  const hits = useMemo(() => {
    const q = query.trim();
    if (!q && !layerActive) {
      return recents.slice(0, 5).map((id) => CARD_BY_ID[id]).filter(Boolean);
    }
    let list = q ? searchCards(q, 200).map((h) => h.card) : CARDS;
    if (layerActive) list = filterCards(list, { colors, periods, units, skills, rarities, costs });
    return list;
  }, [query, colors, periods, units, skills, rarities, costs, recents, layerActive]);

  const layerSummary = [
    colors.length ? colors.join(" ") : null,
    costs.length ? costs.map(formatCost).join("/") + "C" : null,
    units.length ? units.map((u) => UNIT_SHORT[u as keyof typeof UNIT_SHORT] ?? u).join(" ") : null,
    periods.length ? periods.join(" ") : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const clearFilters = () => {
    setColors([]);
    setCosts([]);
    setUnits([]);
    setPeriods([]);
    setSkills([]);
    setRarities([]);
  };

  const resultLabel = query || layerActive
    ? `${hits.length} 筆${layerSummary ? `　${layerSummary}` : ""}`
    : recents.length
      ? "最近查看"
      : "";

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <header className="shrink-0 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4 py-2.5 sm:px-6 sm:pb-3 sm:pt-5">
          <div>
            <p className="hidden text-xs tracking-widest text-faint sm:block">EIKETSU TAISEN</p>
            <div className="flex items-center gap-2">
              <Zap className="size-5 fill-cost text-cost sm:size-6" strokeWidth={2.25} aria-hidden />
              <h1 className="font-display text-xl tracking-tight text-balance sm:text-3xl">英傑大戦 速查</h1>
            </div>
          </div>
          <p className="hidden text-xs tabular-nums text-faint sm:block">{CARD_COUNT} 張</p>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
          <TabBtn id="search" tab={tab} setTab={setTab} icon={<Search className="size-4" />} label="速查" />
          <TabBtn id="skills" tab={tab} setTab={setTab} icon={<BookOpen className="size-4" />} label="特技" />
        </nav>
      </header>

      {tab === "skills" ? (
        <main className="mx-auto w-full max-w-3xl min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <p className="text-sm leading-relaxed text-pretty text-muted">
            1C＝2.4 秒，全場 99C。下面係各特技嘅持續／成本換算。計略嘅具體 C 數喺武將詳情。
          </p>
          <p className="mt-1 text-xs tabular-nums text-faint">5C＝12秒　10C＝24秒　50C＝120秒　先陣約 49C</p>
          <div className="mt-5 flex flex-col gap-3">
            {SKILLS.map((s) => (
              <SkillExplain key={s.id} id={s.id} />
            ))}
          </div>
        </main>
      ) : (
        <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_30rem]">
          <section className="flex min-h-0 min-w-0 flex-col border-border lg:border-r">
            <div className="shrink-0 border-b border-border bg-bg px-4 py-2.5 sm:px-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="織田信長、蒼173、指揮、伏兵…"
                  className="pl-10 pr-10"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label="搜尋武將"
                  suppressHydrationWarning
                />
                {query ? (
                  <button
                    type="button"
                    className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-fg"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="清除"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 shrink-0 items-center gap-0.5 rounded-md bg-surface-2 px-2.5 text-xs text-fg lg:hidden"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-expanded={filtersOpen}
                >
                  篩選
                  {filtersOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>
                <p className="min-w-0 flex-1 truncate text-xs tabular-nums text-faint">{resultLabel}</p>
                {layerActive ? (
                  <button type="button" className="h-8 shrink-0 text-xs text-muted hover:text-fg" onClick={clearFilters}>
                    清除
                  </button>
                ) : null}
              </div>

              <div
                className={cn(
                  "flex-col gap-1 overflow-x-hidden",
                  filtersOpen ? "mt-2 flex max-h-[min(52vh,26rem)] overflow-y-auto" : "hidden",
                  "lg:mt-3 lg:flex lg:max-h-none lg:overflow-visible",
                )}
              >
                <FilterRule label="勢力" />
                <ChipGrid
                  cols="grid-cols-7"
                  items={COLORS.map((c) => ({
                    key: c,
                    label: c,
                    active: colors.includes(c),
                    className: COLOR_CLASS[c],
                    idleClassName: cn("bg-surface-2", COLOR_INK[c]),
                    toggle: () => toggle(colors, c, setColors),
                  }))}
                />
                <FilterRule label="時代" />
                <ChipGrid
                  cols="grid-cols-5"
                  items={PERIODS.map((p) => ({
                    key: p,
                    label: p,
                    active: periods.includes(p),
                    toggle: () => toggle(periods, p, setPeriods),
                  }))}
                />
                <div className="flex min-w-0 flex-col gap-1">
                    <FilterRule label="成本" />
                    <ChipGrid
                      cols="grid-cols-4"
                      items={COSTS.map((c) => ({
                        key: String(c),
                        label: <CostPips cost={c} small />,
                        active: costs.includes(c),
                        ariaLabel: `${formatCost(c)} cost`,
                        toggle: () => toggle(costs, c, setCosts),
                      }))}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <FilterRule label="兵種" />
                    <ChipGrid
                      cols="grid-cols-5"
                      items={UNITS.map((u) => ({
                        key: u,
                        label: <UnitIcon unit={u} className="size-6" />,
                        active: units.includes(u),
                        ariaLabel: u,
                        toggle: () => toggle(units, u, setUnits),
                      }))}
                    />
                  </div>

                <div className="mt-1 flex items-center justify-between">
                  <button
                    type="button"
                    className="h-8 text-xs text-muted hover:text-fg"
                    onClick={() => setMoreFilters((v) => !v)}
                  >
                    特技／稀有{skills.length + rarities.length ? ` ${skills.length + rarities.length}` : ""}
                  </button>
                </div>

                {moreFilters ? (
                  <div className="flex flex-col gap-1 overflow-x-hidden pb-1">
                    <FilterRule label="特技" />
                    <ChipGrid
                      cols="grid-cols-4 sm:grid-cols-6"
                      items={SKILLS.map((s) => ({
                        key: String(s.id),
                        label: s.name,
                        active: skills.includes(s.id),
                        className: "border border-black bg-black text-cost",
                        idleClassName: "border border-black bg-cost text-black",
                        toggle: () => toggle(skills, s.id, setSkills),
                      }))}
                    />
                    <FilterRule label="稀有" />
                    <ChipGrid
                      cols="grid-cols-4"
                      items={RARITIES.map((r) => ({
                        key: r,
                        label: r,
                        active: rarities.includes(r),
                        toggle: () => toggle(rarities, r, setRarities),
                      }))}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:px-4">
              {!hits.length ? (
                <li className="px-3 py-16 text-center text-sm text-muted">
                  {query || layerActive ? "搵唔到。試下改篩選或卡號（蒼173）。" : "對戰時輸入對手武將名或卡號。"}
                </li>
              ) : (
                hits.map((card) => {
                  const active = card.id === selectedId;
                  const dur = formatStratDuration(card);
                  return (
                    <li key={card.id}>
                      <button
                        type="button"
                        onClick={() => select(card.id)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-colors duration-[var(--motion-quick)]",
                          active ? "bg-surface-2" : "hover:bg-surface",
                        )}
                      >
                        <span className={cn("mt-1 h-8 w-1 shrink-0 rounded-full", COLOR_BAR[card.color])} aria-hidden />
                        <div className="min-w-0 flex-1">
                          <CardIdentity card={card} compact />
                          <p className="mt-1 truncate text-xs text-faint">
                            <span className="tabular-nums text-fg">{dur.compact}</span>
                            {"　"}
                            {card.stratName}　士氣{card.stratCost}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          {isDesktop ? (
            <aside className="relative min-h-0 overflow-hidden">
              {selected ? <CardThemeBackdrop card={selected} /> : null}
              <div className="relative z-10 h-full overflow-y-auto p-5">
                {selected ? (
                  <CardDetail card={selected} />
                ) : (
                  <p className="text-sm leading-relaxed text-pretty text-muted">
                    揀一張武將，即睇計略時長同效果值。
                  </p>
                )}
              </div>
            </aside>
          ) : null}
        </div>
      )}

      {selected && tab === "search" && !isDesktop ? (
        <div className="absolute inset-0 z-50 flex min-h-0 flex-col bg-bg">
          <CardThemeBackdrop card={selected} />
          <div className="relative z-10 flex shrink-0 items-center justify-end px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={() => select(null)}
              className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-fg"
              aria-label="關閉"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <CardDetail card={selected} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TabBtn({
  id,
  tab,
  setTab,
  icon,
  label,
}: {
  id: Tab;
  tab: Tab;
  setTab: (t: Tab) => void;
  icon: ReactNode;
  label: string;
}) {
  const active = tab === id;
  return (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={cn(
        "flex h-10 items-center gap-2 border-b-2 px-3 text-sm sm:h-11",
        active ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function toggle<T>(list: T[], value: T, set: (next: T[]) => void) {
  set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
}

function FilterRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 pt-1.5 first:pt-0">
      <span className="shrink-0 text-xs text-faint">{label}</span>
      <span className="h-px min-w-4 flex-1 bg-border" aria-hidden />
    </div>
  );
}

function ChipGrid({
  items,
  cols,
}: {
  cols: string;
  items: {
    key: string;
    label: ReactNode;
    active: boolean;
    toggle: () => void;
    className?: string;
    idleClassName?: string;
    ariaLabel?: string;
  }[];
}) {
  return (
    <div className={cn("grid gap-1", cols)}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.toggle}
          aria-label={item.ariaLabel}
          className={cn(
            "flex h-9 w-full items-center justify-center overflow-hidden rounded-sm px-0.5 text-center text-xs leading-none whitespace-nowrap",
            item.active ? (item.className ?? "bg-accent text-accent-fg") : (item.idleClassName ?? "bg-surface-2 text-muted"),
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
