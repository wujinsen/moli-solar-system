import type { Locale } from "./types";

export interface MenuOverlay {
  starType?: string;
  distanceLy?: string;
  tagline?: string;
  mass?: string;
}

const en: Record<string, MenuOverlay> = {
  solar: {
    starType: "G-type yellow dwarf",
    distanceLy: "Our home",
    tagline: "Eight planets · asteroids · comets",
  },
  kepler90: {
    starType: "G-type yellow dwarf",
    distanceLy: "~2,540 ly",
    tagline: "Planet-count king · 8 worlds",
  },
  hd10180: {
    starType: "G-type yellow dwarf (Sun-like)",
    distanceLy: "~127 ly",
    tagline: "Potential record holder · 7 (up to 9) planets",
  },
  trappist1: {
    starType: "M-type red dwarf",
    distanceLy: "~40 ly",
    tagline: "Habitable-zone hotspot · 7 Earth-sized",
  },
  hr8799: {
    starType: "A-type main-sequence star",
    distanceLy: "~129 ly",
    tagline: "Direct-imaged · 4 giant planets",
  },
  psr1257: {
    starType: "Pulsar (neutron star)",
    distanceLy: "~2,300 ly",
    tagline: "Zombie worlds · first exoplanet system",
  },
  m87: {
    distanceLy: "~55 million ly",
    mass: "~6.5 billion M☉",
    tagline: "First black-hole photo · 2019",
  },
  sgra: {
    distanceLy: "~26,000 ly",
    mass: "~4.15 million M☉",
    tagline: "Milky Way core · imaged 2022",
  },
  gaiabh1: {
    distanceLy: "~1,560 ly",
    mass: "~10 M☉",
    tagline: "Nearest known stellar-mass BH",
  },
  cygx1: {
    distanceLy: "~6,000 ly",
    mass: "~21 M☉",
    tagline: "Historic benchmark · Hawking's bet",
  },
  ton618: {
    distanceLy: "~18.2 billion ly",
    mass: "~66 billion M☉",
    tagline: "Largest known BH · mass champion",
  },
  gargantua: {
    distanceLy: "Interstellar (fiction)",
    mass: "~100 million M☉ (canon)",
    tagline: "Iconic movie BH · Nobel-grade VFX",
  },
};

const ja: Record<string, MenuOverlay> = {
  solar: {
    starType: "G型黄色矮星",
    distanceLy: "我が故郷",
    tagline: "8惑星 · 小惑星帯 · 彗星",
  },
  kepler90: {
    starType: "G型黄色矮星",
    distanceLy: "約2540光年",
    tagline: "惑星数の王者 · 8個",
  },
  hd10180: {
    starType: "G型黄色矮星（太陽型）",
    distanceLy: "約127光年",
    tagline: "潜在的多惑星記録 · 7（最大9）個",
  },
  trappist1: {
    starType: "M型赤色矮星",
    distanceLy: "約40光年",
    tagline: "ハビタブル帯の宝庫 · 7個の地球型",
  },
  hr8799: {
    starType: "A型主系列星",
    distanceLy: "約129光年",
    tagline: "直接撮像 · 4つのガス巨星",
  },
  psr1257: {
    starType: "パルサー（中性子星）",
    distanceLy: "約2300光年",
    tagline: "ゾンビ世界 · 初の系外惑星系",
  },
  m87: {
    distanceLy: "約5500万光年",
    mass: "約65億太陽質量",
    tagline: "初のブラックホール写真 · 2019",
  },
  sgra: {
    distanceLy: "約2.6万光年",
    mass: "約415万太陽質量",
    tagline: "銀河系中心 · 2022年撮像",
  },
  gaiabh1: {
    distanceLy: "約1560光年",
    mass: "約10太陽質量",
    tagline: "地球に最も近い恒星質量BH",
  },
  cygx1: {
    distanceLy: "約6000光年",
    mass: "約21太陽質量",
    tagline: "歴史的標準 · ホーキングの賭け",
  },
  ton618: {
    distanceLy: "約182億光年",
    mass: "約660億太陽質量",
    tagline: "最大級BH · 質量の王者",
  },
  gargantua: {
    distanceLy: "『インターステラー』（架空）",
    mass: "約1億太陽質量（設定）",
    tagline: "映画の象徴BH · ノーベル級VFX",
  },
};

const OVERLAYS: Record<Exclude<Locale, "zh">, Record<string, MenuOverlay>> = {
  en,
  ja,
};

function pick(
  id: string,
  locale: Locale,
  field: keyof MenuOverlay,
  fallback: string
): string {
  if (locale === "zh") return fallback;
  return OVERLAYS[locale][id]?.[field] ?? fallback;
}

export function localizeSystemMenu(
  id: string,
  locale: Locale,
  zh: { starType: string; distanceLy: string; tagline: string }
) {
  return {
    starType: pick(id, locale, "starType", zh.starType),
    distanceLy: pick(id, locale, "distanceLy", zh.distanceLy),
    tagline: pick(id, locale, "tagline", zh.tagline),
  };
}

export function localizeBlackHoleMenu(
  id: string,
  locale: Locale,
  zh: { distanceLy: string; mass: string; tagline: string }
) {
  return {
    distanceLy: pick(id, locale, "distanceLy", zh.distanceLy),
    mass: pick(id, locale, "mass", zh.mass),
    tagline: pick(id, locale, "tagline", zh.tagline),
  };
}
