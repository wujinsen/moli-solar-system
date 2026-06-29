import { findComet } from "./comets";
import { findExoPlanet, findExoStar } from "./systems";
import { findStation, SPACE_STATION } from "./station";
import { findBlackHole } from "./blackholes";

export type BodyCategory =
  | "star"
  | "terrestrial"
  | "gas-giant"
  | "ice-giant"
  | "dwarf";

export interface MoonData {
  id: string;
  name: string;
  nameEn: string;
  radius: number;
  distance: number; // distance from parent planet center
  orbitalPeriod: number; // relative
  color: string;
  description?: string;
}

export interface BodyData {
  id: string;
  name: string;
  nameEn: string;
  category: BodyCategory;
  radius: number; // visual radius
  distance: number; // orbital radius from the Sun (0 for the Sun)
  orbitalPeriod: number; // relative period (Earth = 1); smaller = faster
  rotationPeriod: number; // relative self-rotation period
  axialTilt: number; // degrees
  inclination?: number; // orbital plane tilt (deg), for dwarf planets
  eccentricity?: number; // 0 = circle
  baseColor: string;
  secondaryColor: string;
  textureStyle: "rocky" | "earth" | "gas" | "ice" | "sun";
  atmosphere?: { color: string; intensity: number };
  ring?: { inner: number; outer: number; color: string; tilt: number };
  emissive?: boolean;
  moons?: MoonData[];
  description: string;
  facts: { k: string; v: string }[];
}

// Visual scales are artistically compressed so every body stays visible and
// clickable while preserving relative size relationships.
export const SUN: BodyData = {
  id: "sun",
  name: "太阳",
  nameEn: "The Sun",
  category: "star",
  radius: 9,
  distance: 0,
  orbitalPeriod: 0,
  rotationPeriod: 30,
  axialTilt: 7.25,
  baseColor: "#ffcc55",
  secondaryColor: "#ff6600",
  textureStyle: "sun",
  emissive: true,
  description:
    "太阳是太阳系中唯一的恒星，占据整个太阳系总质量的 99.86%。它通过内部的核聚变源源不断地释放出光和热，是太阳系几乎所有天体能量的来源。",
  facts: [
    { k: "类型", v: "G2V 黄矮星" },
    { k: "质量占比", v: "99.86%" },
    { k: "直径", v: "约 139 万 km" },
    { k: "表面温度", v: "约 5500°C" },
  ],
};

export const PLANETS: BodyData[] = [
  {
    id: "mercury",
    name: "水星",
    nameEn: "Mercury",
    category: "terrestrial",
    radius: 0.55,
    distance: 17,
    orbitalPeriod: 0.24,
    rotationPeriod: 1.5,
    axialTilt: 0.03,
    baseColor: "#9c8a7a",
    secondaryColor: "#5e5246",
    textureStyle: "rocky",
    description:
      "离太阳最近的行星，公转最快。没有真正的大气层，表面布满陨石坑，昼夜温差极大。",
    facts: [
      { k: "距太阳", v: "0.39 AU" },
      { k: "公转周期", v: "88 天" },
      { k: "卫星", v: "0" },
      { k: "昼夜温差", v: "约 600°C" },
    ],
  },
  {
    id: "venus",
    name: "金星",
    nameEn: "Venus",
    category: "terrestrial",
    radius: 0.92,
    distance: 24,
    orbitalPeriod: 0.62,
    rotationPeriod: -3.5,
    axialTilt: 177.4,
    baseColor: "#d8b878",
    secondaryColor: "#a87b3c",
    textureStyle: "rocky",
    atmosphere: { color: "#e8c887", intensity: 1.1 },
    description:
      "表面包裹着厚厚的二氧化碳大气，温室效应极强，是太阳系中最热的行星。自转方向与多数行星相反。",
    facts: [
      { k: "距太阳", v: "0.72 AU" },
      { k: "公转周期", v: "225 天" },
      { k: "卫星", v: "0" },
      { k: "表面温度", v: "约 465°C" },
    ],
  },
  {
    id: "earth",
    name: "地球",
    nameEn: "Earth",
    category: "terrestrial",
    radius: 1.0,
    distance: 32,
    orbitalPeriod: 1.0,
    rotationPeriod: 1.0,
    axialTilt: 23.44,
    baseColor: "#2a6fb0",
    secondaryColor: "#3a8f4a",
    textureStyle: "earth",
    atmosphere: { color: "#5aa9ff", intensity: 1.4 },
    description:
      "我们的家园，目前已知唯一孕育了生命的星球，表面有大量的液态水。拥有一颗天然卫星——月球。",
    facts: [
      { k: "距太阳", v: "1.00 AU" },
      { k: "公转周期", v: "365 天" },
      { k: "卫星", v: "1（月球）" },
      { k: "液态水", v: "丰富" },
    ],
    moons: [
      {
        id: "moon",
        name: "月球",
        nameEn: "Moon",
        radius: 0.27,
        distance: 2.2,
        orbitalPeriod: 0.5,
        color: "#cfcabf",
        description: "地球唯一的天然卫星。",
      },
    ],
  },
  {
    id: "mars",
    name: "火星",
    nameEn: "Mars",
    category: "terrestrial",
    radius: 0.72,
    distance: 41,
    orbitalPeriod: 1.88,
    rotationPeriod: 1.03,
    axialTilt: 25.19,
    baseColor: "#c1502e",
    secondaryColor: "#7a2f1c",
    textureStyle: "rocky",
    atmosphere: { color: "#e0764a", intensity: 0.5 },
    description:
      "被称为“红色星球”，表面有红色的氧化铁沙尘，是人类目前探索地外生命和移民的首选目标。",
    facts: [
      { k: "距太阳", v: "1.52 AU" },
      { k: "公转周期", v: "687 天" },
      { k: "卫星", v: "2" },
      { k: "最高山", v: "奥林帕斯山" },
    ],
    moons: [
      {
        id: "phobos",
        name: "火卫一",
        nameEn: "Phobos",
        radius: 0.12,
        distance: 1.4,
        orbitalPeriod: 0.2,
        color: "#9a8a7c",
      },
      {
        id: "deimos",
        name: "火卫二",
        nameEn: "Deimos",
        radius: 0.09,
        distance: 2.0,
        orbitalPeriod: 0.35,
        color: "#b0a596",
      },
    ],
  },
  {
    id: "jupiter",
    name: "木星",
    nameEn: "Jupiter",
    category: "gas-giant",
    radius: 3.4,
    distance: 62,
    orbitalPeriod: 11.86,
    rotationPeriod: 0.41,
    axialTilt: 3.13,
    baseColor: "#d8b48a",
    secondaryColor: "#9c6b43",
    textureStyle: "gas",
    atmosphere: { color: "#e8cba0", intensity: 0.7 },
    description:
      "太阳系中的“行星之王”，体积和质量最大（质量是其他七大行星总和的 2.5 倍），拥有著名的“大红斑”风暴。",
    facts: [
      { k: "距太阳", v: "5.20 AU" },
      { k: "公转周期", v: "11.9 年" },
      { k: "卫星", v: "95+" },
      { k: "标志", v: "大红斑" },
    ],
    moons: [
      {
        id: "io",
        name: "木卫一",
        nameEn: "Io",
        radius: 0.28,
        distance: 4.6,
        orbitalPeriod: 0.18,
        color: "#e8d27a",
      },
      {
        id: "europa",
        name: "木卫二",
        nameEn: "Europa",
        radius: 0.26,
        distance: 5.6,
        orbitalPeriod: 0.3,
        color: "#cdb89a",
        description: "冰层之下可能存在海洋。",
      },
      {
        id: "ganymede",
        name: "木卫三",
        nameEn: "Ganymede",
        radius: 0.36,
        distance: 6.8,
        orbitalPeriod: 0.45,
        color: "#9b8e7e",
      },
      {
        id: "callisto",
        name: "木卫四",
        nameEn: "Callisto",
        radius: 0.33,
        distance: 8.1,
        orbitalPeriod: 0.6,
        color: "#6f655b",
      },
    ],
  },
  {
    id: "saturn",
    name: "土星",
    nameEn: "Saturn",
    category: "gas-giant",
    radius: 2.9,
    distance: 86,
    orbitalPeriod: 29.46,
    rotationPeriod: 0.44,
    axialTilt: 26.73,
    baseColor: "#e2c691",
    secondaryColor: "#b89a5e",
    textureStyle: "gas",
    atmosphere: { color: "#efdcab", intensity: 0.6 },
    ring: { inner: 3.6, outer: 6.2, color: "#d9c39a", tilt: 26.73 },
    description:
      "以其巨大、壮丽的土星环（由冰块和岩石碎屑组成）而闻名。拥有浓厚大气与液态甲烷湖泊的土卫六也在此。",
    facts: [
      { k: "距太阳", v: "9.58 AU" },
      { k: "公转周期", v: "29.5 年" },
      { k: "卫星", v: "146+" },
      { k: "标志", v: "土星环" },
    ],
    moons: [
      {
        id: "titan",
        name: "土卫六",
        nameEn: "Titan",
        radius: 0.38,
        distance: 7.4,
        orbitalPeriod: 0.5,
        color: "#d9a85c",
        description: "拥有浓厚大气层和液态甲烷湖泊。",
      },
    ],
  },
  {
    id: "uranus",
    name: "天王星",
    nameEn: "Uranus",
    category: "ice-giant",
    radius: 1.9,
    distance: 108,
    orbitalPeriod: 84.01,
    rotationPeriod: -0.72,
    axialTilt: 97.77,
    baseColor: "#a8e0e0",
    secondaryColor: "#6fb6c4",
    textureStyle: "ice",
    atmosphere: { color: "#bff0f0", intensity: 0.9 },
    ring: { inner: 2.4, outer: 3.2, color: "#88b0b8", tilt: 97.77 },
    description:
      "一颗呈蓝绿色的冰巨星，独特之处在于它是“躺着”自转的（自转轴倾斜角达 98 度）。",
    facts: [
      { k: "距太阳", v: "19.2 AU" },
      { k: "公转周期", v: "84 年" },
      { k: "卫星", v: "27+" },
      { k: "自转轴", v: "倾斜 98°" },
    ],
    moons: [
      {
        id: "titania",
        name: "天卫三",
        nameEn: "Titania",
        radius: 0.22,
        distance: 3.6,
        orbitalPeriod: 0.4,
        color: "#9fb4b8",
      },
    ],
  },
  {
    id: "neptune",
    name: "海王星",
    nameEn: "Neptune",
    category: "ice-giant",
    radius: 1.85,
    distance: 126,
    orbitalPeriod: 164.8,
    rotationPeriod: 0.67,
    axialTilt: 28.32,
    baseColor: "#2f5edb",
    secondaryColor: "#1b3a8f",
    textureStyle: "ice",
    atmosphere: { color: "#4f78ff", intensity: 1.1 },
    description:
      "离太阳最远的行星，表面有着太阳系中最猛烈的狂风，呈现深蓝色。",
    facts: [
      { k: "距太阳", v: "30.1 AU" },
      { k: "公转周期", v: "165 年" },
      { k: "卫星", v: "14+" },
      { k: "风速", v: "可达 2100 km/h" },
    ],
    moons: [
      {
        id: "triton",
        name: "海卫一",
        nameEn: "Triton",
        radius: 0.26,
        distance: 3.4,
        orbitalPeriod: -0.4,
        color: "#cdd6e0",
      },
    ],
  },
];

export const DWARF_PLANETS: BodyData[] = [
  {
    id: "pluto",
    name: "冥王星",
    nameEn: "Pluto",
    category: "dwarf",
    radius: 0.4,
    distance: 144,
    orbitalPeriod: 248,
    rotationPeriod: 1.6,
    axialTilt: 122.5,
    inclination: 17,
    eccentricity: 0.25,
    baseColor: "#c7ad94",
    secondaryColor: "#8a7158",
    textureStyle: "rocky",
    description:
      "最著名的矮行星。曾属于“九大行星”之一，2006 年被国际天文学联合会重新定义降级为矮行星。",
    facts: [
      { k: "距太阳", v: "39.5 AU" },
      { k: "公转周期", v: "248 年" },
      { k: "卫星", v: "5" },
      { k: "状态", v: "矮行星（2006）" },
    ],
    moons: [
      {
        id: "charon",
        name: "冥卫一",
        nameEn: "Charon",
        radius: 0.2,
        distance: 1.4,
        orbitalPeriod: 0.4,
        color: "#a89c8e",
      },
    ],
  },
];

export const ALL_BODIES: BodyData[] = [SUN, ...PLANETS, ...DWARF_PLANETS];

export function findBody(id: string | null): BodyData | undefined {
  if (!id) return undefined;
  return ALL_BODIES.find((b) => b.id === id);
}

const CATEGORY_LABEL: Record<BodyCategory, string> = {
  star: "恒星",
  terrestrial: "类地行星",
  "gas-giant": "气态巨行星",
  "ice-giant": "冰巨星",
  dwarf: "矮行星",
};

// Find a moon (and its parent planet) by id, searching every planet/dwarf.
export function findMoon(
  id: string | null
): { moon: MoonData; parent: BodyData } | undefined {
  if (!id) return undefined;
  for (const p of [...PLANETS, ...DWARF_PLANETS]) {
    const moon = p.moons?.find((m) => m.id === id);
    if (moon) return { moon, parent: p };
  }
  return undefined;
}

export function getMoonParentId(id: string | null): string | null {
  return findMoon(id)?.parent.id ?? null;
}

// Visual radius for any selectable object (planet, sun, dwarf, or moon).
export function getBodyRadius(id: string | null): number {
  const b = findBody(id);
  if (b) return b.radius;
  const moon = findMoon(id);
  if (moon) return moon.moon.radius;
  const comet = findComet(id);
  if (comet) return comet.nucleusRadius;
  const exo = findExoPlanet(id);
  if (exo) return exo.planet.radius;
  const exoStar = findExoStar(id);
  if (exoStar) return exoStar.star.radius;
  if (findStation(id)) return SPACE_STATION.radius;
  const bh = findBlackHole(id);
  if (bh) return bh.visual.horizonRadius;
  return 0;
}

export interface ResolvedSelection {
  id: string;
  name: string;
  nameEn: string;
  radius: number;
  tag: string;
  description: string;
  facts: { k: string; v: string }[];
  isMoon: boolean;
  isExo?: boolean;
  parentName?: string;
  canOrbit: boolean;
}

// Normalize either a planet or a moon into a single display descriptor.
export function resolveSelection(
  id: string | null
): ResolvedSelection | undefined {
  if (!id) return undefined;
  const b = findBody(id);
  if (b) {
    return {
      id: b.id,
      name: b.name,
      nameEn: b.nameEn,
      radius: b.radius,
      tag: CATEGORY_LABEL[b.category],
      description: b.description,
      facts: b.facts,
      isMoon: false,
      canOrbit: b.id !== "sun",
    };
  }
  const found = findMoon(id);
  if (found) {
    const { moon, parent } = found;
    return {
      id: moon.id,
      name: moon.name,
      nameEn: moon.nameEn,
      radius: moon.radius,
      tag: "天然卫星",
      description: moon.description ?? `${parent.name}的天然卫星。`,
      facts: [
        { k: "类型", v: "天然卫星" },
        { k: "母星", v: parent.name },
      ],
      isMoon: true,
      parentName: parent.name,
      canOrbit: true,
    };
  }
  const comet = findComet(id);
  if (comet) {
    return {
      id: comet.id,
      name: comet.name,
      nameEn: comet.nameEn,
      radius: comet.nucleusRadius,
      tag: "周期彗星",
      description: comet.description,
      facts: comet.facts,
      isMoon: false,
      canOrbit: false,
    };
  }
  const exo = findExoPlanet(id);
  if (exo) {
    const { planet } = exo;
    return {
      id: planet.id,
      name: planet.name,
      nameEn: planet.nameEn,
      radius: planet.radius,
      tag: planet.candidate
        ? "候选行星"
        : planet.habitable
        ? "宜居带行星"
        : "系外行星",
      description: planet.description,
      facts: planet.facts,
      isMoon: false,
      isExo: true,
      canOrbit: true,
    };
  }
  const exoStar = findExoStar(id);
  if (exoStar) {
    const { star } = exoStar;
    return {
      id: star.id,
      name: star.name,
      nameEn: star.nameEn,
      radius: star.radius,
      tag: star.pulsar ? "脉冲星" : "恒星",
      description: star.description,
      facts: star.facts,
      isMoon: false,
      isExo: true,
      canOrbit: false,
    };
  }
  const station = findStation(id);
  if (station) {
    return {
      id: station.id,
      name: station.name,
      nameEn: station.nameEn,
      radius: station.radius,
      tag: "空间站",
      description: station.description,
      facts: [...station.facts],
      isMoon: false,
      canOrbit: true,
    };
  }
  const bh = findBlackHole(id);
  if (bh) {
    return {
      id: bh.id,
      name: bh.name,
      nameEn: bh.nameEn,
      radius: bh.visual.horizonRadius,
      tag: bh.categoryLabel,
      description: bh.description,
      facts: [...bh.facts],
      isMoon: false,
      canOrbit: false,
    };
  }
  return undefined;
}

// Region radii for asteroid / Kuiper belts (between Mars & Jupiter, beyond Neptune)
export const ASTEROID_BELT = { inner: 47, outer: 56 };
export const KUIPER_BELT = { inner: 134, outer: 168 };
