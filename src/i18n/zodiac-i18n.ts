import type { Locale } from "./types";
import type { ZodiacElement } from "../data/zodiac";

type ZodiacField = "name" | "blurb" | "rulingPlanet" | "brightestStar";
type SignLocaleMap = Record<
  string,
  {
    en: Record<ZodiacField, string>;
    ja: Record<ZodiacField, string>;
  }
>;

const ELEMENT_LABELS: Record<ZodiacElement, { en: string; ja: string }> = {
  fire: { en: "Fire", ja: "火" },
  earth: { en: "Earth", ja: "地" },
  air: { en: "Air", ja: "風" },
  water: { en: "Water", ja: "水" },
};

const ZH_ELEMENT_LABELS: Record<ZodiacElement, string> = {
  fire: "火象",
  earth: "土象",
  air: "风象",
  water: "水象",
};

const ZODIAC_I18N: SignLocaleMap = {
  aries: {
    en: {
      name: "Aries",
      blurb:
        "The first house of the zodiac, symbolizing the beginning of spring. In myth, it is the winged ram with the golden fleece that sparked the legendary quest.",
      rulingPlanet: "Mars",
      brightestStar: "Hamal",
    },
    ja: {
      name: "牡羊座",
      blurb:
        "黄道十二宮の第一宮で、春の始まりを象徴します。神話では、金の羊毛を持つ翼ある羊が、あの大冒険の発端となりました。",
      rulingPlanet: "火星",
      brightestStar: "ハマル",
    },
  },
  taurus: {
    en: {
      name: "Taurus",
      blurb:
        "The bull's head is outlined by a V-shaped cluster, with reddish Aldebaran as its fierce eye. Nearby lies the famous Pleiades star cluster.",
      rulingPlanet: "Venus",
      brightestStar: "Aldebaran",
    },
    ja: {
      name: "牡牛座",
      blurb:
        "牡牛の頭部はV字の星並びで描かれ、赤く輝くアルデバランが怒りに満ちた眼のように見えます。近くには有名なプレアデス星団もあります。",
      rulingPlanet: "金星",
      brightestStar: "アルデバラン",
    },
  },
  gemini: {
    en: {
      name: "Gemini",
      blurb:
        "The twin brothers Castor and Pollux stand side by side, formed by two parallel lines of bright stars, with the paired head stars shining the brightest.",
      rulingPlanet: "Mercury",
      brightestStar: "Pollux",
    },
    ja: {
      name: "双子座",
      blurb:
        "並んで立つ双子の兄弟カストルとポルックスを表し、平行する二列の明るい星で形作られます。頭頂の双星がひときわ目立ちます。",
      rulingPlanet: "水星",
      brightestStar: "ポルックス",
    },
  },
  cancer: {
    en: {
      name: "Cancer",
      blurb:
        "One of the faintest zodiac constellations, shaped like an inverted Y. At its center is the Beehive Cluster, an open cluster visible to the naked eye.",
      rulingPlanet: "Moon",
      brightestStar: "Al Tarf",
    },
    ja: {
      name: "蟹座",
      blurb:
        "黄道十二星座の中でも特に暗く、逆さのY字のような形をしています。中心のプレセペ星団（ビーハイブ星団）は肉眼でも見える散開星団です。",
      rulingPlanet: "月",
      brightestStar: "アル・タルフ",
    },
  },
  leo: {
    en: {
      name: "Leo",
      blurb:
        "The lion's head and mane are traced by the sickle-shaped asterism. Regulus, the Lion's Heart, blazes brightly, while stars at the rear form a triangular hindbody.",
      rulingPlanet: "Sun",
      brightestStar: "Regulus",
    },
    ja: {
      name: "獅子座",
      blurb:
        "獅子の頭とたてがみは、鎌のような星並びで描かれます。獅子の心臓とされるレグルスは非常に明るく、後方の星々は三角形の胴体を作ります。",
      rulingPlanet: "太陽",
      brightestStar: "レグルス",
    },
  },
  virgo: {
    en: {
      name: "Virgo",
      blurb:
        "The harvest goddess holding a sheaf of wheat, Virgo is the second largest constellation in the sky. Blue-white Spica marks the shining wheat in her hand.",
      rulingPlanet: "Mercury",
      brightestStar: "Spica",
    },
    ja: {
      name: "乙女座",
      blurb:
        "麦穂を手にした豊穣の女神を表し、全天で二番目に大きな星座です。青白く輝くスピカは、彼女の手の麦穂を象徴します。",
      rulingPlanet: "水星",
      brightestStar: "スピカ",
    },
  },
  libra: {
    en: {
      name: "Libra",
      blurb:
        "The only non-living zodiac sign, Libra is a scale symbolizing justice. In ancient times, it was considered to be the claws of Scorpius.",
      rulingPlanet: "Venus",
      brightestStar: "Zubeneschamali",
    },
    ja: {
      name: "天秤座",
      blurb:
        "黄道十二星座で唯一、生き物ではない天秤の星座です。正義の象徴とされ、古くは蠍座のはさみの一部と見なされていました。",
      rulingPlanet: "金星",
      brightestStar: "ズベン・エシャマリ",
    },
  },
  scorpio: {
    en: {
      name: "Scorpio",
      blurb:
        "A giant scorpion with raised claws and a curled tail. The red supergiant Antares beats like its heart, and the long body bends to a venomous stinger.",
      rulingPlanet: "Pluto / Mars",
      brightestStar: "Antares",
    },
    ja: {
      name: "蠍座",
      blurb:
        "大きなはさみと反り上がる尾を持つ巨大な蠍の姿です。赤色超巨星アンタレスは心臓のように輝き、長い体は毒針へと弧を描きます。",
      rulingPlanet: "冥王星 / 火星",
      brightestStar: "アンタレス",
    },
  },
  sagittarius: {
    en: {
      name: "Sagittarius",
      blurb:
        "The centaur archer. Its brightest stars form the famous Teapot shape, and the arrow points toward the direction of the Galactic Center.",
      rulingPlanet: "Jupiter",
      brightestStar: "Kaus Australis",
    },
    ja: {
      name: "射手座",
      blurb:
        "半人半馬の射手を表します。明るい星々は有名な「ティーポット」の形を作り、矢先は天の川銀河中心の方向を指しています。",
      rulingPlanet: "木星",
      brightestStar: "カウス・アウストラリス",
    },
  },
  capricorn: {
    en: {
      name: "Capricorn",
      blurb:
        "The sea-goat, with a goat's front and fish's tail. Its stars form a broad triangle, making it one of the dimmer constellations on the zodiac.",
      rulingPlanet: "Saturn",
      brightestStar: "Deneb Algedi",
    },
    ja: {
      name: "山羊座",
      blurb:
        "上半身が山羊、下半身が魚の「海山羊」を表します。星々は大きな三角形をなし、黄道十二星座の中では比較的暗い部類です。",
      rulingPlanet: "土星",
      brightestStar: "デネブ・アルゲディ",
    },
  },
  aquarius: {
    en: {
      name: "Aquarius",
      blurb:
        "The water bearer. A broken line above suggests the jar in his hands, while the winding stream below represents water pouring toward Piscis Austrinus.",
      rulingPlanet: "Uranus / Saturn",
      brightestStar: "Sadalsuud",
    },
    ja: {
      name: "水瓶座",
      blurb:
        "水を注ぐ青年の姿で、上部の折れ線は手にした水瓶、下へ続く星の流れは南の魚座へ注がれる水を象徴します。",
      rulingPlanet: "天王星 / 土星",
      brightestStar: "サダルスウド",
    },
  },
  pisces: {
    en: {
      name: "Pisces",
      blurb:
        "Two fish swimming in opposite directions, linked by a ribbon. In myth, Aphrodite and her son transformed into fish to escape the monster Typhon.",
      rulingPlanet: "Neptune / Jupiter",
      brightestStar: "Alpherg",
    },
    ja: {
      name: "魚座",
      blurb:
        "逆方向へ泳ぐ二匹の魚がリボンで結ばれた姿です。神話では、愛の女神アフロディーテとその子が怪物テュポンから逃れるため魚に変身したとされます。",
      rulingPlanet: "海王星 / 木星",
      brightestStar: "アルフェルグ",
    },
  },
};

/**
 * Panel labels for zodiac facts.
 * If you prefer centralizing these in `ui.ts`, add:
 * - zodiac.prefix
 * - zodiac.fact.date
 * - zodiac.fact.element
 * - zodiac.fact.rulingPlanet
 * - zodiac.fact.brightestStar
 */
export const ZODIAC_PANEL_LABELS: Record<
  Locale,
  {
    prefix: string;
    factDate: string;
    factElement: string;
    factRulingPlanet: string;
    factBrightestStar: string;
  }
> = {
  zh: {
    prefix: "黄道",
    factDate: "日期",
    factElement: "属性",
    factRulingPlanet: "守护星",
    factBrightestStar: "主星",
  },
  en: {
    prefix: "Zodiac",
    factDate: "Dates",
    factElement: "Element",
    factRulingPlanet: "Ruling Planet",
    factBrightestStar: "Brightest Star",
  },
  ja: {
    prefix: "黄道",
    factDate: "日付",
    factElement: "属性",
    factRulingPlanet: "守護星",
    factBrightestStar: "主星",
  },
};

export function getZodiacElementLabel(
  element: ZodiacElement,
  locale: Locale
): string {
  if (locale === "zh") return ZH_ELEMENT_LABELS[element];
  return ELEMENT_LABELS[element][locale];
}

export function getZodiacSignField(
  id: string,
  field: "name" | "blurb" | "rulingPlanet" | "brightestStar",
  locale: Locale,
  fallback: string
): string {
  if (locale === "zh") return fallback;
  return ZODIAC_I18N[id]?.[locale]?.[field] ?? fallback;
}
