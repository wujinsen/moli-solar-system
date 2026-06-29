import type { Locale } from "./types";

const EXACT_EN: Record<string, string> = {
  丰富: "Abundant",
  "1（月球）": "1 (Moon)",
  "G2V 黄矮星": "G2V yellow dwarf",
  "99.86%": "99.86%",
  "约 139 万 km": "~1.39 million km",
  "约 5500°C": "~5,500°C",
  "约 600°C": "~600°C",
  "约 465°C": "~465°C",
  奥林帕斯山: "Olympus Mons",
  大红斑: "Great Red Spot",
  土星环: "Ring system",
  "倾斜 98°": "Tilted 98°",
  "可达 2100 km/h": "Up to 2,100 km/h",
  "运行中 · 全系统在线": "Online · all systems go",
  "补给 · 科研 · 深空中转": "Supply · research · deep-space hub",
  "火星轨道 MO": "Mars orbit",
  火星: "Mars",
  "1P/Halley": "1P/Halley",
  "162.3°（逆行）": "162.3° (retrograde)",
  "1986 年 2 月": "Feb 1986",
  "2061 年 7 月": "Jul 2061",
  "约 75.3 年": "~75.3 years",
  "G 型黄矮星": "G-type yellow dwarf",
  "8 颗": "8",
  "真实贴图 · 星座 · 彗星": "Real textures · constellations · comets",
};

const EXACT_JA: Record<string, string> = {
  丰富: "豊富",
  "1（月球）": "1（月）",
  "G2V 黄矮星": "G2V型黄色矮星",
  "99.86%": "99.86%",
  "约 139 万 km": "約139万km",
  "约 5500°C": "約5500°C",
  "约 600°C": "約600°C",
  "约 465°C": "約465°C",
  奥林帕斯山: "オリンポス山",
  大红斑: "大赤斑",
  土星环: "土星の環",
  "倾斜 98°": "自転軸98°",
  "可达 2100 km/h": "最大2100km/h",
  "运行中 · 全系统在线": "稼働中 · 全システムオンライン",
  "补给 · 科研 · 深空中转": "補給 · 研究 · 深宇宙ハブ",
  "火星轨道 MO": "火星軌道",
  火星: "火星",
  "1P/Halley": "1P/Halley",
  "162.3°（逆行）": "162.3°（逆行）",
  "1986 年 2 月": "1986年2月",
  "2061 年 7 月": "2061年7月",
  "约 75.3 年": "約75.3年",
  "G 型黄矮星": "G型黄色矮星",
  "8 颗": "8個",
  "真实贴图 · 星座 · 彗星": "リアルテクスチャ · 星座 · 彗星",
};

export function localizeFactValue(v: string, locale: Locale): string {
  if (locale === "zh") return v;
  const exact = locale === "en" ? EXACT_EN[v] : EXACT_JA[v];
  if (exact) return exact;

  if (locale === "en") {
    return v
      .replace(/^约 /, "~")
      .replace(/ 光年$/, " ly")
      .replace(/(\d+) 天$/, "$1 days")
      .replace(/约 (\d+) 天$/, "~$1 days")
      .replace(/(\d+) 年$/, "$1 years")
      .replace(/约 ([\d.]+) 年$/, "~$1 years")
      .replace(/(\d+) 颗$/, "$1")
      .replace(/约 ([\d.]+) AU$/, "~$1 AU")
      .replace(/（([^）]+)）/g, " ($1)")
      .replace(/月球/g, "Moon")
      .replace(/万光年/, " million ly")
      .replace(/亿光年/, " billion ly")
      .replace(/倍太阳/, " M☉");
  }

  return v
    .replace(/^约 /, "約")
    .replace(/ 光年$/, "光年")
    .replace(/(\d+) 天$/, "$1日")
    .replace(/(\d+) 年$/, "$1年")
    .replace(/（/g, "（")
    .replace(/倍太阳/g, "太陽質量");
}
