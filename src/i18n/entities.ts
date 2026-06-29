import type { Locale, EntityOverlay } from "./types";

/** Chinese tag → category key in ui.ts */
export const TAG_TO_CATEGORY: Record<string, string> = {
  恒星: "star",
  类地行星: "terrestrial",
  气态巨行星: "gas-giant",
  冰巨星: "ice-giant",
  矮行星: "dwarf",
  天然卫星: "moon",
  周期彗星: "comet",
  空间站: "station",
  超大质量黑洞: "supermassive",
  恒星级黑洞: "stellar",
  极端记录保持者: "record",
  科幻图腾: "fiction",
  候选行星: "candidate",
  宜居带行星: "habitable",
  系外行星: "exo",
  脉冲星: "pulsar",
};

const en: Record<string, EntityOverlay> = {
  sun: {
    description:
      "The Sun is the sole star of the Solar System, accounting for 99.86% of its total mass. Nuclear fusion in its core powers nearly all life and motion in the system.",
  },
  mercury: {
    description:
      "Closest planet to the Sun with the fastest orbit. No real atmosphere; cratered surface and extreme day–night temperature swings.",
  },
  venus: {
    description:
      "Thick CO₂ atmosphere drives a runaway greenhouse effect—the hottest planet in the Solar System. Rotates retrograde.",
  },
  earth: {
    description:
      "The only known world with liquid surface water and life. A protective magnetic field and moderate climate make it our home.",
  },
  moon: {
    description: "Earth's only natural satellite, tidally locked, scarred by ancient impacts.",
  },
  mars: {
    description:
      "The Red Planet—thin atmosphere, vast volcanoes and canyons, polar ice caps, and two small moons.",
  },
  jupiter: {
    description:
      "Largest planet—a gas giant with banded clouds, the Great Red Spot, and dozens of moons including volcanic Io.",
  },
  saturn: {
    description:
      "Famous for its spectacular ring system and many icy moons, including Titan with a thick atmosphere.",
  },
  uranus: {
    description:
      "An ice giant tilted on its side, with faint rings and a pale cyan atmosphere of hydrogen, helium, and methane.",
  },
  neptune: {
    description:
      "Outermost ice giant; deep blue from methane, supersonic winds, and the moon Triton in a retrograde orbit.",
  },
  ship: {
    name: "Autumn Wind",
    tag: "Starship",
    description: "Captain Master Chief · cruising the inner Solar System",
  },
  station: {
    name: "Orbital Station",
    tag: "Space Station",
    description: "Mars orbit · all systems online",
  },
  halley: {
    description:
      "Halley's Comet—the most famous periodic comet, returning every ~76 years with a bright tail when near the Sun.",
  },
};

const ja: Record<string, EntityOverlay> = {
  sun: {
    description:
      "太陽系唯一の恒星で、総質量の99.86%を占めます。核融合が光と熱を供給し、ほぼすべての天体のエネルギー源です。",
  },
  mercury: {
    description:
      "太陽に最も近い惑星。大気はほとんどなく、クレーターだらけの表面と極端な昼夜の温度差があります。",
  },
  venus: {
    description:
      "厚い二酸化炭素大気による強烈な温室効果で、太陽系で最も高温の惑星です。逆行自転します。",
  },
  earth: {
    description:
      "液体の水と生命が確認されている唯一の惑星。磁場と穏やかな気候が生命を支えています。",
  },
  moon: {
    description: "地球唯一の天然衛星。潮汐固定され、古いクレーターが残っています。",
  },
  mars: {
    description:
      "「赤い惑星」—薄い大気、巨大な火山と峡谷、極冠、フォボスとダイモスという二つの衛星。",
  },
  jupiter: {
    description:
      "最大のガス巨星。縞模様、大赤斑、イオなど多数の衛星を持ちます。",
  },
  saturn: {
    description:
      "壮観な環と多数の氷の衛星で知られ、タイタンは厚い大気を持ちます。",
  },
  uranus: {
    description:
      "横倒しの自転軸を持つ氷巨星。淡いシアンの大気と薄い環があります。",
  },
  neptune: {
    description:
      "最も外側の氷巨星。メタンによる深い青色、超音速の風、逆行する衛星トリトン。",
  },
  ship: {
    name: "秋風之敦号",
    tag: "星間船",
    description: "艦長 マスター・チーフ · 太陽系内航行",
  },
  station: {
    name: "星間ステーション",
    tag: "宇宙ステーション",
    description: "火星軌道 · 全システム稼働中",
  },
  halley: {
    description:
      "最も有名な周期彗星。約76年ごとに太陽近傍で明るい尾を見せます。",
  },
};

export const ENTITY_OVERLAYS: Record<Exclude<Locale, "zh">, Record<string, EntityOverlay>> = {
  en,
  ja,
};

export function getEntityOverlay(
  id: string,
  locale: Locale
): EntityOverlay | undefined {
  if (locale === "zh") return undefined;
  return ENTITY_OVERLAYS[locale][id];
}

/** Localized solar-system briefing card */
export const SOLAR_BRIEF: Record<
  Locale,
  { tag: string; name: string; nameEn: string; description: string; facts: { k: string; v: string }[] }
> = {
  zh: {
    tag: "我们的家园",
    name: "太阳系",
    nameEn: "Solar System",
    description:
      "八大行星、小行星带、彗星与黄道星座共同组成的恒星系统。曲速引擎就绪后，即可从深空返航回到这里。",
    facts: [
      { k: "恒星", v: "G 型黄矮星" },
      { k: "行星", v: "8 颗" },
      { k: "特色", v: "真实贴图 · 星座 · 彗星" },
    ],
  },
  en: {
    tag: "Our Home",
    name: "Solar System",
    nameEn: "Solar System",
    description:
      "Eight planets, asteroid belt, comets, and zodiac constellations. Engage warp drive to return here from deep space.",
    facts: [
      { k: "Star", v: "G-type yellow dwarf" },
      { k: "Planets", v: "8" },
      { k: "Highlights", v: "Real textures · constellations · comets" },
    ],
  },
  ja: {
    tag: "我が故郷",
    name: "太陽系",
    nameEn: "Solar System",
    description:
      "8つの惑星、小惑星帯、彗星、黄道星座からなる恒星系。ワープエンジンで深宇宙から帰還できます。",
    facts: [
      { k: "恒星", v: "G型黄色矮星" },
      { k: "惑星", v: "8個" },
      { k: "特徴", v: "リアルテクスチャ · 星座 · 彗星" },
    ],
  },
};
