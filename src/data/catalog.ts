import raw from "./cards.json";
import { isDurationEffectLabel, translateArea, translateCat, translateDesc, translateLabel, translateValue } from "./translate";

export type Rarity = "N" | "R" | "SR" | "ER";
export type ColorName = "蒼" | "緋" | "碧" | "玄" | "紫" | "琥" | "黄";
export type UnitName = "騎兵" | "槍兵" | "弓兵" | "剣豪" | "鉄砲隊";
export type StratTime = "知力時間" | "一瞬" | "撤退するまで" | "固定時間";

export type CardEffect = { label: string; value: string };

export type Card = {
  id: string;
  no: string;
  name: string;
  kana: string;
  color: ColorName;
  period: string;
  cost: number;
  rarity: Rarity;
  unit: UnitName;
  power: number;
  intel: number;
  skills: number[];
  stratName: string;
  stratKana: string;
  stratCost: number;
  stratDesc: string;
  stratCats: string[];
  stratTime: string;
  durC: number | null;
  depC: number | null;
  durNote: string;
  effects: CardEffect[];
  area: string;
  dbUrl: string;
};

export type StatLine = { label: string; value: string };

export type KonshinTierId = "strong" | "weak" | "none";

export type KonshinTier = {
  id: KonshinTierId;
  title: string;
  morale: string;
  rows: StatLine[];
};


export type SkillDef = {
  id: number;
  name: string;
  short: string;
  official: string;
  detail: string;
  playTip: string;
  kind: "open" | "combat" | "move" | "gauge";
  facts: StatLine[];
  durationC?: string;
};

export type StratDuration = {
  compact: string;
  label: string;
  seconds: string;
  dep: string;
  extra: string;
  hint: string;
};

export const COLORS: ColorName[] = ["蒼", "緋", "碧", "玄", "紫", "琥", "黄"];
export const UNITS: UnitName[] = ["騎兵", "槍兵", "弓兵", "剣豪", "鉄砲隊"];
export const PERIODS = ["戦国", "江戸･幕末", "三国志", "平安", "中世", "春秋戦国", "古代", "特殊"];
export const PERIOD_LABEL: Record<string, string> = {
  戦国: "戰國",
  "江戸･幕末": "江戶・幕末",
  三国志: "三國志",
  平安: "平安",
  中世: "中世",
  春秋戦国: "春秋戰國",
  古代: "古代",
  特殊: "特殊",
};
export const RARITIES: Rarity[] = ["N", "R", "SR", "ER"];
export const COSTS = [1, 1.5, 2, 2.5, 3, 3.5, 4];

export const UNIT_SHORT: Record<UnitName, string> = {
  騎兵: "騎",
  槍兵: "槍",
  弓兵: "弓",
  剣豪: "剣",
  鉄砲隊: "砲",
};

export const COLOR_CLASS: Record<ColorName, string> = {
  蒼: "bg-faction-ao text-white",
  緋: "bg-faction-hi text-white",
  碧: "bg-faction-heki text-white",
  玄: "bg-faction-gen text-white",
  紫: "bg-faction-shi text-white",
  琥: "bg-faction-ko text-accent-fg",
  黄: "bg-faction-ou text-accent-fg",
};

export const COLOR_INK: Record<ColorName, string> = {
  蒼: "text-faction-ao",
  緋: "text-faction-hi",
  碧: "text-faction-heki",
  玄: "text-fg",
  紫: "text-faction-shi",
  琥: "text-faction-ko",
  黄: "text-faction-ou",
};

export const COLOR_BAR: Record<ColorName, string> = {
  蒼: "bg-faction-ao",
  緋: "bg-faction-hi",
  碧: "bg-faction-heki",
  玄: "bg-faction-gen",
  紫: "bg-faction-shi",
  琥: "bg-faction-ko",
  黄: "bg-faction-ou",
};

/** 1 カウント ＝ 2.4 秒。全場由 99C 數到 00。 */
export const COUNT_SECONDS = 2.4;
export const MATCH_COUNTS = 99;

export const SKILLS: SkillDef[] = [
  {
    id: 0,
    name: "伏兵",
    short: "伏",
    official: "敵軍視点から視認されない伏兵状態で開戦します。敵部隊と接触すると知力差によるダメージを与え、伏兵状態は解除されます。",
    detail:
      "開場以伏兵登場，對手睇唔到、移速大幅下降、唔可以攻擊。接觸敵部隊時依知力差造成傷害然後解除。伏兵中幾乎唔食戰鬥傷害，弓同斬擊通常打不中，但傷害計略命中、撞柵／櫓、入攻城區、歸城、自己放計略都會解除。",
    playTip: "對戰時先估對手知力。高知力伏兵係開場爆發。霸氣槽無故跳動往往代表附近有伏兵。",
    kind: "open",
    facts: [
      { label: "傷害", value: "30 × (己知力 ÷ 敵知力) ＋ 10" },
      { label: "同知力", value: "約 40%" },
      { label: "固定部份", value: "約 10%" },
    ],
  },
  {
    id: 1,
    name: "防柵",
    short: "柵",
    official: "敵部隊の動きを阻害する障害物「柵」を部隊前方に配置した状態で開戦します。",
    detail:
      "開場喺部隊前方放柵，擋敵移動。持有幾個防柵就放幾道。柵被敵部隊撞到一定次數後破壞。唔擋己方。亦可擋鐵砲射擊（達次數仍會壞），貫通射擊仍然有效。",
    playTip: "用來卡路、保護弓砲、拖延攻城。見到防柵要改道或用傷害計略清掉。",
    kind: "open",
    facts: [{ label: "放置", value: "每 1 個防柵＝前方 1 道柵" }],
  },
  {
    id: 2,
    name: "復活",
    short: "活",
    official: "撤退した際、復活するために必要な時間が減少します。",
    detail:
      "撤退後復活等待時間縮短。依卡組「復活」持有數疊加，唔係每張卡各自 −4 秒。",
    playTip: "對手復活多＝戰線唔容易空。擊破後要趁復活空窗推城。",
    kind: "combat",
    facts: [
      { label: "1 個", value: "−4 秒（約 1.7C）" },
      { label: "2 個", value: "−7 秒（約 2.9C）" },
      { label: "3 個", value: "−9 秒（約 3.8C）" },
    ],
    durationC: "復活等待縮短 1.7〜3.8C",
  },
  {
    id: 3,
    name: "忍",
    short: "忍",
    official: "敵軍視点から視認されない隠密状態になります。ただし敵部隊または敵城に近づくと隠密状態は解除されます。",
    detail:
      "遠離敵部隊／敵城時進入隠密，對手睇唔到人、亦睇唔到出城煙。靠近約 1.5 卡距離或敵城第一格、撞柵櫓、被傷害計略打中、被兵種動作打中會解除。離開後過一段時間會再隠密。弓通常鎖唔到隠密目標。突擊光環、槍光環、出入城特效都會藏起。",
    playTip: "側襲、繞後、偷攻城嘅訊號。睇霸氣槽異常跳動或突然現形位置嚟捉。",
    kind: "move",
    facts: [{ label: "現形距離", value: "約 1.5 張卡距離／敵城第一格" }],
  },
  {
    id: 4,
    name: "気合",
    short: "気",
    official: "通常の戦闘で受けたダメージの一部を一定時間ごとに回復します。",
    detail:
      "受到嘅一般戰鬥傷害有一部分以紅色兵力顯示，並隨時間回復。弓攻擊期間氣合回復唔會發動。伏兵知力傷害同計略減血唔會轉成紅槽。超過 100% 兵力嘅部份亦唔回。",
    playTip: "氣合槍騎唔好用磨血，要一次打穿或用計略傷害。弓壓制可停其回復。",
    kind: "combat",
    facts: [
      { label: "可回復比例", value: "一般戰鬥傷害嘅 15%" },
      { label: "回復節奏", value: "每 2.0 秒（約 0.8C）回 1.5%" },
    ],
    durationC: "回復間隔 0.8C",
  },
  {
    id: 5,
    name: "狙撃",
    short: "狙",
    official: "同じ射撃対象を一定時間ロックオンし続けることで、コストに応じてより強力な射撃を行える狙撃状態になります。",
    detail:
      "鐵砲隊專用。持續鎖定同一目標後照準由藍變黃，進入狙撃。狙撃傷害更高、命中會擊退、瞬間唔可以歸城，並解除騎兵突擊準備。效果隨成本上升。",
    playTip: "被鎖時立刻側移、進掩體或拿前排去擋。高成本狙撃非常痛。",
    kind: "combat",
    facts: [
      { label: "鎖定時間", value: "2 秒（約 0.8C）" },
      { label: "追加傷害", value: "成本愈高愈強；2.5C 時每擊約 +0.5%" },
    ],
    durationC: "鎖定 0.8C",
  },
  {
    id: 6,
    name: "昂揚",
    short: "昂",
    official: "コストに応じて士気が増加した状態で開戦します。",
    detail:
      "開場即加士氣。持有昂揚嘅武將成本每 0.5C，士氣 ＋0.1（合計 5.0C ＝ 士氣 1）。同一張卡有兩個昂揚會再倍增。",
    playTip: "把對手昂揚成本加總 ×0.2 就係額外開場士氣。高昂揚卡組會搶先手計略。",
    kind: "open",
    facts: [
      { label: "公式", value: "士氣 ＋（昂揚成本合計 × 0.2）" },
      { label: "1.0C", value: "＋0.2 士氣" },
      { label: "2.0C", value: "＋0.4 士氣" },
      { label: "2.5C", value: "＋0.5 士氣" },
      { label: "3.0C", value: "＋0.6 士氣" },
      { label: "3.5C", value: "＋0.7 士氣" },
    ],
  },
  {
    id: 7,
    name: "技巧",
    short: "技",
    official: "コストに応じて流派ゲージが増加した状態で開戦します。",
    detail:
      "開場增加流派槽。持有技巧嘅武將成本每 0.5C，流派槽 ＋1/60（合計 5.0C ＝ 整條槽嘅 1/6）。",
    playTip: "技巧多嘅卡組中期會突然變強。盡早打斷其流派節奏。",
    kind: "open",
    facts: [
      { label: "公式", value: "槽 ＋（技巧成本合計 ÷ 30）條" },
      { label: "1.5C", value: "約 5.0%" },
      { label: "2.5C", value: "約 8.3%" },
      { label: "5.0C", value: "約 16.7%（1/6 條）" },
    ],
  },
  {
    id: 8,
    name: "先陣",
    short: "先",
    official: "開戦から一定時間、武力と知力が上がります。",
    detail:
      "開場期間武力、知力各 ＋1。倒數時鐘由 99C 去到 50C 為止（約頭 49C）。持有多個先陣會再疊加。",
    playTip: "開場唔好正面硬剛先陣隊，等紅利結束再打，或用妨害拖時間。",
    kind: "open",
    facts: [
      { label: "持續", value: "99C → 50C（約 49C／118 秒）" },
      { label: "加成", value: "武力 ＋1、知力 ＋1（可疊）" },
    ],
    durationC: "約 49C（99→50）",
  },
  {
    id: 9,
    name: "鬼",
    short: "鬼",
    official: "兵力が一定以下になると、兵種アクションによるダメージと弾き効果を軽減します。",
    detail:
      "兵力掉到約 40% 以下後，兵種動作（突擊、槍擊、斬擊、射擊等）嘅傷害同彈開會減輕。亂戰同計略傷害唔減。兵力回上去會解除。發動時名牌右上圖示變亮。",
    playTip: "鬼武將殘血好黏。用計略傷害或知力傷害補刀，唔好只靠兵種動作磨。",
    kind: "combat",
    facts: [
      { label: "發動", value: "兵力約 40% 以下" },
      { label: "傷害", value: "兵種動作傷害約變成 2/3" },
      { label: "彈開", value: "彈開距離約變成 1/3" },
    ],
  },
  {
    id: 10,
    name: "疾駆",
    short: "疾",
    official: "兵種に応じて移動速度が上がります。",
    detail: "依兵種提高移動速度。騎兵加幅較細，其他兵種較明顯。",
    playTip: "疾驅要預判走位，用柵、槍線或範圍計略攔截，唔好追直線。",
    kind: "move",
    facts: [
      { label: "騎兵", value: "移速 ＋約 5%" },
      { label: "其他兵種", value: "移速 ＋約 10%" },
    ],
  },
  {
    id: 11,
    name: "大兵",
    short: "兵",
    official: "特技「大兵」を持つ武将と同じ時代の武将コスト合計に応じて最大兵力が上がります。",
    detail:
      "同持有「大兵」嘅武將同一時代嘅登錄成本愈高，最大兵力愈高。同時代集中嘅卡組會特別肉。",
    playTip: "睇對手時代係咪集中。同時代大兵隊要用範圍傷害或計略處理。",
    kind: "open",
    facts: [
      { label: "合計 1.0C", value: "最大兵力 ＋約 5%" },
      { label: "合計 2.0C", value: "＋約 10%" },
      { label: "合計 4.0C", value: "＋約 15%" },
      { label: "合計 9.0C", value: "＋約 30%" },
    ],
  },
  {
    id: 12,
    name: "同盟",
    short: "盟",
    official: "最大士気が増加した状態で開戦します。ただし１５より多くならない。",
    detail: "開場提高最大士氣上限。每 1 個同盟 ＋1，唔會超過 15。",
    playTip: "同盟＝後期大型計略威脅。前期要壓節奏，別讓對方把槽存滿。",
    kind: "open",
    facts: [{ label: "最大士氣", value: "每個同盟 ＋1（上限 15）" }],
  },
  {
    id: 13,
    name: "槍術",
    short: "槍",
    official: "コストに応じて槍が長くなり、槍撃ダメージが上がります。",
    detail:
      "槍兵特技。成本愈高槍愈長、槍擊傷害愈高。高成本槍術能喺接觸前就捅到人。",
    playTip: "唔好對槍線正面衝。側繞、伏兵或遠程處理。",
    kind: "combat",
    facts: [
      { label: "1.0C 槍擊", value: "＋約 0.6%" },
      { label: "1.5C", value: "＋約 0.8%" },
      { label: "2.0C", value: "＋約 1.0%" },
      { label: "2.5C", value: "＋約 1.2%" },
      { label: "3.0C", value: "＋約 1.4%" },
      { label: "3.5C", value: "槍擊 ＋約 1.6%　槍長 ＋約 45%" },
    ],
  },
  {
    id: 14,
    name: "黄熾",
    short: "黄",
    official: "黄熾ゲージが一定以上になると、武力と知力が上がります。黄熾ゲージは覇道の前進により増加し、時間経過で減少します。",
    detail:
      "黃勢特有節奏。霸道前進同專用計略加黃熾槽，時間經過會掉。槽達約 1/3（黃色）時武力、知力上升。拖慢對方霸道可壓呢套。",
    playTip: "黃熾隊會搶推霸道。中途卡住霸道就能削佢哋嘅數值紅利。",
    kind: "gauge",
    facts: [
      { label: "發動", value: "黃熾槽約 1/3 以上　武＋2 知＋2" },
      { label: "自然衰減", value: "每 1.3C −2.5%" },
    ],
    durationC: "衰減節奏 1.3C",
  },
  {
    id: 15,
    name: "覇気",
    short: "覇",
    official: "武将コストに応じて覇気が溜まる量が増え、特技「覇気」を持つ武将の武将コスト合計に応じて英傑呼応のダメージが上がります。",
    detail: "加快霸氣累積，並依「覇気」持有武將成本合計提高英傑呼應（攻城呼應）傷害。推城威脅明顯。",
    playTip: "覇氣多＝城好痛。要擋霸道、清前排，或用復活差搶攻城交換。",
    kind: "gauge",
    facts: [
      { label: "霸氣累積", value: "約 1.3 倍" },
      { label: "呼應傷害", value: "合計 1C ＋0.3%　2C ＋0.6%　3C ＋0.9%　6C ＋1.8%" },
    ],
  },
  {
    id: 16,
    name: "宿星",
    short: "星",
    official: "宿星ゲージが一定以上になると、武力と知力が上がります。宿星ゲージは与えたダメージに応じて増加します。",
    detail:
      "造成傷害會加宿星槽。槽 100% 以上武知各 ＋1，200%（宿星狀態）各 ＋2。打得順就會雪球。",
    playTip: "唔好同宿星隊對磨。用妨害、風箏、集火秒掉輸出點。",
    kind: "gauge",
    facts: [
      { label: "槽增加", value: "造成傷害嘅 60%" },
      { label: "200% 所需", value: "累積傷害約等於兵力 333%" },
      { label: "100% / 200%", value: "武知 ＋1 / ＋2" },
    ],
  },
];

const payload = raw as { count: number; cards: Card[] };
export const CARDS: Card[] = payload.cards;
export const CARD_COUNT = payload.count;

export const CARD_BY_ID: Record<string, Card> = Object.fromEntries(CARDS.map((c) => [c.id, c]));

export function skillById(id: number): SkillDef {
  return SKILLS[id] ?? SKILLS[0];
}

export function thumbUrl(card: Card): string {
  return `https://image.eiketsu-taisen.net/general/card_small/${card.id}.jpg`;
}

export function officialUrl(card: Card): string {
  return `https://eiketsu-taisen.net/datalist/?s=general&c=${card.id}`;
}

export function formatCost(n: number): string {
  return n.toFixed(1);
}

export function formatCount(c: number): string {
  const n = Math.round(c * 10) / 10;
  return Number.isInteger(n) ? `${n}C` : `${n.toFixed(1)}C`;
}

export function countToSeconds(c: number): number {
  return Math.round(c * COUNT_SECONDS * 10) / 10;
}

export function ambushDamage(selfIntel: number, enemyIntel: number): number {
  if (enemyIntel <= 0) return 30 * selfIntel + 10;
  return Math.round((30 * (selfIntel / enemyIntel) + 10) * 10) / 10;
}

export function koageFromCost(cost: number): number {
  return Math.round(cost * 0.2 * 10) / 10;
}

export function gikouFromCost(cost: number): number {
  return Math.round((cost / 30) * 1000) / 10;
}

/** 槍術槍擊傷害加成（%）。1.0C→0.6，之後每 0.5C ＋0.2。 */
export function spearDamageBonus(cost: number): number {
  return Math.round((0.2 + cost * 0.4) * 10) / 10;
}

export function hakiCallBonus(cost: number): number {
  return Math.round(cost * 0.3 * 10) / 10;
}

export function skillNames(card: Card): string {
  if (!card.skills.length) return "無特技";
  const counts = new Map<number, number>();
  for (const id of card.skills) counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts.entries()]
    .map(([id, n]) => {
      const name = SKILLS[id]?.name ?? "?";
      return n > 1 ? `${name}×${n}` : name;
    })
    .join("　");
}

/** 對戰速查用：特技名＋此卡參數，唔帶解說。 */
export function compactSkill(card: Card, id: number): string {
  const name = SKILLS[id]?.name ?? "?";
  const copies = card.skills.filter((s) => s === id).length;
  switch (id) {
    case 0:
      return `${name} 打6 ${ambushDamage(card.intel, 6)}%`;
    case 2:
      return `${name} −4秒`;
    case 4:
      return `${name} 0.8C`;
    case 5:
      return `${name} 鎖 0.8C`;
    case 6:
      return `${name} ＋${koageFromCost(card.cost * copies)}`;
    case 7:
      return `${name} ${gikouFromCost(card.cost * copies)}%`;
    case 8:
      return copies > 1 ? `${name} 49C 武＋${copies}` : `${name} 49C`;
    case 10:
      return card.unit === "騎兵" ? `${name} ＋5%` : `${name} ＋10%`;
    case 11:
      return `${name} ${formatCost(card.cost)}C`;
    case 12:
      return `${name} ＋${copies}`;
    case 13:
      return `${name} ＋${spearDamageBonus(card.cost)}%`;
    case 14:
      return `${name} 衰 1.3C`;
    case 15:
      return `${name} ${formatCost(card.cost)}C`;
    default:
      return name;
  }
}


export function stratTimeNote(time: string): string {
  switch (time) {
    case "知力時間":
      return "時長跟知力。下面列出嘅 C 已係此卡計略時長，唔好再加知力×依存（會重複計）。";
    case "一瞬":
      return "官方寫一瞬。若有列出 C，多數係據點／殘留效果時長。";
    case "撤退するまで":
      return "直到呢張卡撤退為止。";
    case "固定時間":
      return "固定時長，唔跟知力加減。";
    default:
      return time;
  }
}

function durQualifier(note: string): string {
  if (!note) return "";
  if (note.includes("以上")) return "以上";
  if (note.includes("弱")) return "弱";
  if (note.includes("強")) return "強";
  return "";
}

export function formatStratDuration(card: Card): StratDuration {
  const q = durQualifier(card.durNote);
  const hint = stratTimeNote(card.stratTime);
  if (card.durC != null) {
    const core = formatCount(card.durC);
    const label = q ? `${core} ${q}` : core;
    const compact = q ? `${core}${q}` : core;
    const dep = card.depC != null ? `知力依存 ${formatCount(card.depC)}／知力` : card.stratTime === "固定時間" ? "固定時長，唔跟知力" : "";
    const extraBits: string[] = [];
    if (card.stratTime === "撤退するまで") extraBits.push("直至撤退");
    if (card.stratTime === "一瞬") extraBits.push("官方分類：一瞬");
    return {
      compact,
      label,
      seconds: `約 ${countToSeconds(card.durC)} 秒`,
      dep,
      extra: extraBits.join("　"),
      hint,
    };
  }

  if (card.stratTime === "一瞬") {
    return { compact: "一瞬", label: "一瞬", seconds: "0C", dep: "", extra: "", hint };
  }
  if (card.stratTime === "撤退するまで") {
    return { compact: "至撤退", label: "直至撤退", seconds: "", dep: "", extra: "", hint };
  }
  if (card.durNote) {
    const note = translateValue(card.durNote);
    return { compact: note, label: note, seconds: "", dep: "", extra: "", hint };
  }
  if (card.stratTime === "知力時間") {
    return { compact: "知力時", label: "知力時間", seconds: "", dep: "", extra: "資料庫未列具體 C 數。", hint };
  }
  return { compact: translateValue(card.stratTime), label: translateValue(card.stratTime), seconds: "", dep: "", extra: "", hint };
}

export function displayEffects(card: Card): StatLine[] {
  return effectRows(mainEffects(card));
}

/** 紫勢力渾身：eiketsudb 由弱至強（無→弱→強），畫面由左至右 強｜弱｜無。 */
export function isKonshinCard(card: Card): boolean {
  return (card.stratCats ?? []).includes("渾身");
}

const KONSHIN_PRIMARY = ["武力上昇", "武力低下", "知力上昇", "知力低下", "復活時兵力"];

function skipKonshinLabel(label: string): boolean {
  return label.startsWith("効果時間") || isDurationEffectLabel(label);
}

function pickKonshinSplitLabel(items: CardEffect[]): string | null {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.label, (counts.get(item.label) ?? 0) + 1);
  const first = items[0]?.label;
  if (first && (counts.get(first) ?? 0) >= 2) return first;
  const primary = KONSHIN_PRIMARY.find((label) => (counts.get(label) ?? 0) >= 2);
  if (primary) return primary;
  let best = "";
  let bestN = 0;
  for (const item of items) {
    const n = counts.get(item.label) ?? 0;
    if (n > bestN) {
      best = item.label;
      bestN = n;
    }
  }
  return bestN >= 2 ? best : null;
}

function splitKonshinGroups(effects: CardEffect[]): CardEffect[][] {
  const items = effects.filter((e) => !skipKonshinLabel(e.label));
  if (!items.length) return [];
  const splitLabel = pickKonshinSplitLabel(items);
  if (!splitLabel) return [items];

  const firstIdx = items.findIndex((e) => e.label === splitLabel);
  const prefix = firstIdx > 0 ? items.slice(0, firstIdx) : [];
  const rest = items.slice(Math.max(firstIdx, 0));

  const groups: CardEffect[][] = [];
  let current: CardEffect[] = [];
  for (const item of rest) {
    if (item.label === splitLabel && current.some((row) => row.label === splitLabel)) {
      groups.push(current);
      current = [item];
    } else {
      current.push(item);
    }
  }
  if (current.length) groups.push(current);

  if (prefix.length) {
    if (groups.length === 2) groups.unshift(prefix);
    else if (groups.length) groups[0] = [...prefix, ...groups[0]];
    else groups.push(prefix);
  }
  return groups;
}

function collapseKonshinGroups(groups: CardEffect[][]): CardEffect[][] {
  if (groups.length <= 3) return groups;
  if (groups.length === 5) {
    return [groups[0], [...groups[1], ...groups[2]], [...groups[3], ...groups[4]]];
  }
  return [groups[0], groups[1], groups.slice(2).flat()];
}

function effectRows(effects: CardEffect[]): StatLine[] {
  const rows: StatLine[] = [];
  const seen = new Set<string>();
  for (const effect of effects) {
    if (isDurationEffectLabel(effect.label) || effect.label.startsWith("効果時間")) continue;
    const label = translateLabel(effect.label);
    const value = translateValue(effect.value);
    const key = `${label}|${value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ label, value });
  }
  return rows;
}

export function konshinTiers(card: Card): KonshinTier[] | null {
  if (!isKonshinCard(card)) return null;
  const groups = collapseKonshinGroups(splitKonshinGroups(card.effects ?? []));
  if (groups.length < 2) return null;

  const noneRows = effectRows(groups[0] ?? []);
  const weakRows = effectRows(groups[1] ?? groups[0] ?? []);
  const strongRows = effectRows(groups[2] ?? groups[1] ?? groups[0] ?? []);
  const cost = card.stratCost;

  return [
    { id: "strong", title: "強渾身", morale: `士氣 ${cost}`, rows: strongRows },
    { id: "weak", title: "弱渾身", morale: `士氣 ${cost + 1}`, rows: weakRows },
    { id: "none", title: "無渾身", morale: `士氣 ${cost + 2}+`, rows: noneRows },
  ];
}

export type KokouCol = {
  id: string;
  title: string;
  swords: number | null;
  highlight: boolean;
  rows: StatLine[];
};

export type KokouTiers = {
  max: number | null;
  note: string;
  shared: StatLine[];
  extra: { title: string; rows: StatLine[] } | null;
  cols: KokouCol[];
};

export function isKokouCard(card: Card): boolean {
  return (card.stratCats ?? []).includes("琥煌");
}

function parseFullWidthInt(raw: string): number {
  const z = "０１２３４５６７８９";
  return Number(
    [...raw].map((ch) => {
      const i = z.indexOf(ch);
      return i >= 0 ? String(i) : ch;
    }).join(""),
  );
}

function parseKokouMax(desc: string): number | null {
  const m = desc.match(/最大消費\s*([0-9０-９]+)/);
  if (!m) return null;
  const n = parseFullWidthInt(m[1]);
  return Number.isFinite(n) ? n : null;
}

function pickKokouSplitLabel(items: CardEffect[], expected: number | null): string | null {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.label, (counts.get(item.label) ?? 0) + 1);
  const ranked = [...counts.entries()]
    .filter(([label]) => label !== "特殊効果")
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (expected) {
    const exact = ranked.find(([, n]) => n === expected);
    if (exact) return exact[0];
    const almost = ranked.find(([, n]) => n === expected - 1 || n === expected + 1);
    if (almost) return almost[0];
  }
  return ranked[0] && ranked[0][1] >= 2 ? ranked[0][0] : null;
}

function splitRepeatingGroups(items: CardEffect[], splitLabel: string): CardEffect[][] {
  const groups: CardEffect[][] = [];
  let current: CardEffect[] = [];
  for (const item of items) {
    if (item.label === splitLabel && current.some((row) => row.label === splitLabel)) {
      groups.push(current);
      current = [item];
    } else {
      current.push(item);
    }
  }
  if (current.length) groups.push(current);
  return groups;
}

export function kokouTiers(card: Card): KokouTiers | null {
  if (!isKokouCard(card)) return null;
  const items = mainEffects(card).filter((e) => !skipKonshinLabel(e.label));
  if (!items.length) return null;

  const max = parseKokouMax(card.stratDesc);
  const expected = max == null ? null : max + 1;
  const splitLabel = pickKokouSplitLabel(items, expected);
  const firstIdx = splitLabel ? items.findIndex((e) => e.label === splitLabel) : 0;
  const shared = firstIdx > 0 ? items.slice(0, firstIdx) : [];
  const rest = items.slice(Math.max(firstIdx, 0));
  let groups = splitLabel ? splitRepeatingGroups(rest, splitLabel) : [rest];

  let extra: CardEffect[] | null = null;
  if (expected && groups.length === expected + 1) {
    extra = groups[0];
    groups = groups.slice(1);
  }
  if (expected && groups.length === expected - 1 && groups.length >= 1) {
    const core = new Set(groups[0].map((e) => e.label));
    const last = groups[groups.length - 1];
    const cut = last.findIndex((e, i) => i > 0 && !core.has(e.label) && e.label !== splitLabel);
    if (cut > 0) groups = [...groups.slice(0, -1), last.slice(0, cut), last.slice(cut)];
  }

  if (groups.length < 2) return null;

  if (max == null) {
    return {
      max: 6,
      note: "睇發動時所持劍數（唔係自己揀食幾多）。",
      shared: effectRows(shared),
      extra: extra ? { title: "無友軍", rows: effectRows(extra) } : null,
      cols: [
        { id: "0-5", title: "0–5劍", swords: null, highlight: false, rows: effectRows(groups[0] ?? []) },
        {
          id: "6",
          title: "6劍",
          swords: 6,
          highlight: true,
          rows: effectRows(groups.slice(1).flat()),
        },
      ],
    };
  }

  return {
    max,
    note: `琥煌槽最多 6 劍。發動時食 0–${max} 劍，食愈多效果愈強。`,
    shared: effectRows(shared),
    extra: extra ? { title: "無友軍", rows: effectRows(extra) } : null,
    cols: groups.map((group, i) => ({
      id: String(i),
      title: `${i}劍`,
      swords: i,
      highlight: i === groups.length - 1,
      rows: effectRows(group),
    })),
  };
}


export function displayArea(card: Card): string {
  return translateArea(card.area ?? "");
}

export type Tanken = {
  name: string;
  cost: string | null;
  text: string;
  rows: StatLine[];
};

function fullwidthNum(input: string): string {
  return input.replace(/[０-９]/g, (ch) => String(ch.charCodeAt(0) - 0xff10)).replace(/．/g, ".");
}

function parseTankenBlocks(desc: string): { main: string; blocks: { name: string; cost: string | null; text: string }[] } {
  const raw = (desc ?? "").replace(/<br\s*\/?>/gi, "\n");
  const idx = raw.search(/短計[・･]/);
  if (idx < 0) return { main: desc ?? "", blocks: [] };
  const main = raw.slice(0, idx).trim();
  const tail = raw.slice(idx);
  const re = /短計[・･]([^【\n：:]{1,24})(?:【([^】]+)】)?\s*[：:]?\s*/g;
  const marks: { name: string; cost: string | null; start: number; body: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(tail))) {
    marks.push({
      name: m[1].trim(),
      cost: m[2] ? fullwidthNum(m[2]).trim() : null,
      start: m.index,
      body: m.index + m[0].length,
    });
  }
  const blocks = marks.map((mark, i) => ({
    name: mark.name,
    cost: mark.cost,
    text: tail.slice(mark.body, i + 1 < marks.length ? marks[i + 1].start : tail.length).trim(),
  }));
  return { main, blocks };
}

const TANKEN_KEEP =
  /再使用間隔|特殊効果|弾き距離|突撃距離|知力ダメージ|武力ダメージ|固定ダメージ|ダメージ係数|移動不可|ため時間|跳躍距離|兵種変化|敵城門ダメージ|ボール/;

function tankenEffectIndex(effects: CardEffect[]): number {
  let seal = -1;
  let reuse = -1;
  effects.forEach((effect, i) => {
    if (effect.label === "計略封印") seal = i;
    if (effect.label === "再使用間隔") reuse = i;
  });
  if (seal >= 0 && (reuse < 0 || seal < reuse)) return seal + 1;
  if (reuse < 0) return -1;
  let start = reuse;
  for (let i = reuse - 1; i >= 0; i--) {
    const lab = effects[i].label;
    const val = effects[i].value;
    if (lab === "計略封印") break;
    if (lab.startsWith("効果時間") && /知力依存|撤退|旗陣形/.test(val)) break;
    if (lab !== "効果時間" && !TANKEN_KEEP.test(lab)) break;
    start = i;
  }
  return start;
}

function mainEffects(card: Card): CardEffect[] {
  const effects = card.effects ?? [];
  if (!parseTankenBlocks(card.stratDesc ?? "").blocks.length) return effects;
  const idx = tankenEffectIndex(effects);
  return idx >= 0 ? effects.slice(0, idx) : effects;
}

function tankenRows(effects: CardEffect[]): StatLine[] {
  const rows: StatLine[] = [];
  const seen = new Set<string>();
  for (const effect of effects) {
    const label = translateLabel(effect.label);
    const value = translateValue(effect.value);
    const key = `${label}|${value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ label, value });
  }
  return rows;
}

export function cardTanken(card: Card): Tanken[] {
  const { blocks } = parseTankenBlocks(card.stratDesc ?? "");
  if (!blocks.length) return [];
  const effects = card.effects ?? [];
  const idx = tankenEffectIndex(effects);
  const fx = idx >= 0 ? effects.slice(idx) : [];
  return blocks.map((block, i) => ({
    name: block.name,
    cost: block.cost,
    text: translateDesc(block.text),
    rows: i === 0 ? tankenRows(fx) : [],
  }));
}

export function displayMainStratDesc(card: Card): string {
  const { main, blocks } = parseTankenBlocks(card.stratDesc ?? "");
  if (!blocks.length) return translateDesc(card.stratDesc ?? "");
  return translateDesc(main);
}

export function displayCats(card: Card): string[] {
  return (card.stratCats ?? []).map(translateCat);
}

export function displayStratDesc(card: Card): string {
  return translateDesc(card.stratDesc ?? "");
}

export function skillCardFacts(card: Card, skillId: number): StatLine[] {
  const copies = card.skills.filter((id) => id === skillId).length;
  switch (skillId) {
    case 0:
      return [
        { label: "此卡知力", value: String(card.intel) },
        { label: "打知力 6", value: `${ambushDamage(card.intel, 6)}%` },
        { label: "打知力 8", value: `${ambushDamage(card.intel, 8)}%` },
        { label: "打知力 10", value: `${ambushDamage(card.intel, 10)}%` },
      ];
    case 2:
      return [{ label: "此卡持有", value: `${copies} 個　（卡組合計先算縮短）` }];
    case 5:
      return [
        { label: "鎖定", value: "2 秒（約 0.8C）" },
        { label: "此卡成本", value: `${formatCost(card.cost)}C　追加傷害隨 C 上升` },
        { label: "參考", value: "2.5C 時每擊約 +0.5%" },
      ];
    case 6:
      return [
        {
          label: "開場士氣",
          value: `＋${koageFromCost(card.cost * copies)}　（${formatCost(card.cost)}C × 0.2${copies > 1 ? ` ×${copies}` : ""}）`,
        },
      ];
    case 7:
      return [
        {
          label: "開場流派槽",
          value: `約 ${gikouFromCost(card.cost * copies)}%　（${formatCost(card.cost)}C${copies > 1 ? ` ×${copies}` : ""}）`,
        },
      ];
    case 8:
      return [
        { label: "持續", value: "99C → 50C（約 49C／118 秒）" },
        { label: "加成", value: copies > 1 ? `武＋${copies} 知＋${copies}` : "武＋1 知＋1" },
      ];
    case 10:
      return [{ label: "此卡移速", value: card.unit === "騎兵" ? "＋約 5%" : "＋約 10%" }];
    case 11:
      return [{ label: "此卡貢獻", value: `${formatCost(card.cost)}C（同時代大兵合計）` }];
    case 12:
      return [{ label: "最大士氣", value: `＋${copies}（上限 15）` }];
    case 13:
      return [
        { label: "此卡槍擊", value: `＋約 ${spearDamageBonus(card.cost)}%` },
        {
          label: "槍長",
          value: `${formatCost(card.cost)}C 加長${card.cost >= 3.5 ? "（約 ＋45%）" : "（3.5C 約 ＋45%）"}`,
        },
      ];
    case 14:
      return [
        { label: "發動", value: "槽約 1/3　武＋2 知＋2" },
        { label: "衰減", value: "每 1.3C −2.5%" },
      ];
    case 15:
      return [
        { label: "霸氣累積", value: "約 1.3 倍" },
        { label: "英傑呼應", value: `此卡 ${formatCost(card.cost)}C 約 ＋${hakiCallBonus(card.cost)}%` },
      ];
    case 16:
      return [
        { label: "槽增加", value: "造成傷害嘅 60%" },
        { label: "100% / 200%", value: "武知 ＋1 / ＋2" },
      ];
    default:
      return [];
  }
}
