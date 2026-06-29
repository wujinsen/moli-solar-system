export type BlackHoleCategory =
  | "supermassive"
  | "stellar"
  | "record"
  | "fiction";

export interface BlackHoleVisual {
  horizonRadius: number; // event horizon (black sphere) radius, scene units
  diskInner: number; // accretion disk inner radius
  diskOuter: number; // accretion disk outer radius
  inclination: number; // 0 = face-on donut, 1 = edge-on (Interstellar look)
  colorHot: string; // inner (hot) disk color
  colorCool: string; // outer (cool) disk color
  spin: number; // swirl animation speed
  doppler: number; // 0..1 brightness asymmetry (relativistic beaming)
  brightness: number; // overall disk emission multiplier
  halo: boolean; // lensed perpendicular ring (over-the-top arc)
  jet: boolean; // bipolar relativistic jets
  jetColor: string;
  jetLength: number;
  overview: number; // camera framing distance
}

export interface BlackHole {
  id: string;
  name: string;
  nameEn: string;
  category: BlackHoleCategory;
  categoryLabel: string;
  distanceLy: string;
  mass: string;
  tagline: string;
  description: string;
  facts: { k: string; v: string }[];
  visual: BlackHoleVisual;
}

export const BLACK_HOLES: BlackHole[] = [
  {
    id: "m87",
    name: "M87*",
    nameEn: "M87* (Virgo A)",
    category: "supermassive",
    categoryLabel: "超大质量黑洞",
    distanceLy: "约 5500 万光年",
    mass: "约 65 亿倍太阳",
    tagline: "人类第一张黑洞照片 · 2019",
    description:
      "室女座 M87 星系中心的超大质量黑洞。2019 年事件视界望远镜（EHT）公布了人类历史上第一张黑洞照片——那个著名的橙红色“发光甜甜圈”。它大到可以轻松吞下整个太阳系，并以接近光速向外喷射长达数千光年的巨型等离子体喷流。",
    facts: [
      { k: "位置", v: "室女座 M87 星系中心" },
      { k: "距离", v: "约 5500 万光年" },
      { k: "质量", v: "约 65 亿倍太阳" },
      { k: "里程碑", v: "首张黑洞照片(2019)" },
    ],
    visual: {
      horizonRadius: 11,
      diskInner: 12.4,
      diskOuter: 48,
      inclination: 0.22,
      colorHot: "#fff2c4",
      colorCool: "#ff6a2a",
      spin: 0.9,
      doppler: 0.55,
      brightness: 1.25,
      halo: true,
      jet: true,
      jetColor: "#9bd2ff",
      jetLength: 170,
      overview: 150,
    },
  },
  {
    id: "sgra",
    name: "人马座 A*",
    nameEn: "Sagittarius A*",
    category: "supermassive",
    categoryLabel: "超大质量黑洞",
    distanceLy: "约 2.6 万光年",
    mass: "约 415 万倍太阳",
    tagline: "银河系自家核心 · 2022",
    description:
      "银河系正中心的超大质量黑洞，2022 年人类公布的第二张黑洞照片主角。虽然质量比 M87* 小得多，但因为就在我们家园中心，被科学家密切跟踪了数十年。2020 年诺贝尔物理学奖正是颁给了通过观测周围恒星运动间接证实它存在的科学家。",
    facts: [
      { k: "位置", v: "银河系正中心" },
      { k: "距离", v: "约 2.6 万光年" },
      { k: "质量", v: "约 415 万倍太阳" },
      { k: "荣誉", v: "2020 诺贝尔物理学奖" },
    ],
    visual: {
      horizonRadius: 9,
      diskInner: 10.1,
      diskOuter: 40,
      inclination: 0.35,
      colorHot: "#ffe6b0",
      colorCool: "#ff8a3a",
      spin: 1.1,
      doppler: 0.45,
      brightness: 1.05,
      halo: true,
      jet: false,
      jetColor: "#bcd8ff",
      jetLength: 90,
      overview: 130,
    },
  },
  {
    id: "gaiabh1",
    name: "Gaia BH1",
    nameEn: "Gaia BH1",
    category: "stellar",
    categoryLabel: "恒星级黑洞",
    distanceLy: "约 1560 光年",
    mass: "约 10 倍太阳",
    tagline: "离地球最近的“大门口”黑洞",
    description:
      "蛇夫座方向，目前已知距离太阳系最近的黑洞。它处于“休眠”状态，非常隐蔽——科学家是通过观测一颗和太阳一模一样的恒星在太空中产生诡异的“绕圈晃动”，才算出它身边竟潜伏着一个看不见的引力巨兽。",
    facts: [
      { k: "位置", v: "蛇夫座" },
      { k: "距离", v: "约 1560 光年" },
      { k: "质量", v: "约 10 倍太阳" },
      { k: "状态", v: "休眠 · 最近黑洞" },
    ],
    visual: {
      horizonRadius: 6,
      diskInner: 6.7,
      diskOuter: 24,
      inclination: 0.82,
      colorHot: "#bcd0ff",
      colorCool: "#5a6f9c",
      spin: 0.5,
      doppler: 0.35,
      brightness: 0.55,
      halo: true,
      jet: false,
      jetColor: "#acc4ff",
      jetLength: 60,
      overview: 95,
    },
  },
  {
    id: "cygx1",
    name: "天鹅座 X-1",
    nameEn: "Cygnus X-1",
    category: "stellar",
    categoryLabel: "恒星级黑洞",
    distanceLy: "约 6000 光年",
    mass: "约 21 倍太阳",
    tagline: "历史标杆 · 霍金打赌输掉的黑洞",
    description:
      "人类历史上第一个被广泛证实的黑洞（1971 年）。当年为了争论它到底是不是黑洞，霍金和《星际穿越》科学顾问索恩打过一个著名的赌（霍金赌它不是，最后认输）。它正疯狂吸积旁边一颗蓝超巨星的物质，释放出强烈的 X 射线。",
    facts: [
      { k: "位置", v: "天鹅座" },
      { k: "距离", v: "约 6000 光年" },
      { k: "质量", v: "约 21 倍太阳" },
      { k: "身份", v: "首个证实黑洞(1971)" },
    ],
    visual: {
      horizonRadius: 6.5,
      diskInner: 7.3,
      diskOuter: 30,
      inclination: 0.78,
      colorHot: "#e8f4ff",
      colorCool: "#3f7fd0",
      spin: 1.4,
      doppler: 0.6,
      brightness: 1.15,
      halo: true,
      jet: true,
      jetColor: "#cfe6ff",
      jetLength: 110,
      overview: 110,
    },
  },
  {
    id: "ton618",
    name: "TON 618",
    nameEn: "TON 618",
    category: "record",
    categoryLabel: "极端记录保持者",
    distanceLy: "约 182 亿光年",
    mass: "约 660 亿倍太阳",
    tagline: "已知最大黑洞 · 宇宙质量之王",
    description:
      "猎犬座方向极远深空的怪兽，目前人类已知的宇宙黑洞质量之王。引力视界半径高达约 1300 天文单位——若放在太阳系中心，能一口吞掉连同冥王星、旅行者号在内的所有空间。它驱动的类星体亮度是整个银河系的 140 万倍。",
    facts: [
      { k: "方向", v: "猎犬座极远深空" },
      { k: "距离", v: "约 182 亿光年" },
      { k: "质量", v: "约 660 亿倍太阳" },
      { k: "视界半径", v: "约 1300 AU" },
    ],
    visual: {
      horizonRadius: 17,
      diskInner: 19,
      diskOuter: 74,
      inclination: 0.3,
      colorHot: "#ffffff",
      colorCool: "#7aa8ff",
      spin: 0.8,
      doppler: 0.5,
      brightness: 1.6,
      halo: true,
      jet: true,
      jetColor: "#d6e6ff",
      jetLength: 240,
      overview: 220,
    },
  },
  {
    id: "gargantua",
    name: "卡冈图雅",
    nameEn: "Gargantua",
    category: "fiction",
    categoryLabel: "科幻图腾",
    distanceLy: "《星际穿越》虚构",
    mass: "约 1 亿倍太阳（设定）",
    tagline: "最完美的模拟黑洞 · 诺贝尔级渲染",
    description:
      "出自诺兰科幻电影《星际穿越》的虚构黑洞。虽是虚构，它的视觉渲染由诺奖得主基普·索恩团队亲自撰写引力方程、用超级计算机渲染数月完成。其多普勒造成的“一侧亮一侧暗”、以及引力透镜导致盘面折叠的视觉效果，完美预言了后来人类拍到的真实黑洞照片。",
    facts: [
      { k: "来源", v: "《星际穿越》(2014)" },
      { k: "渲染", v: "基普·索恩团队" },
      { k: "设定质量", v: "约 1 亿倍太阳" },
      { k: "意义", v: "最经典黑洞形象" },
    ],
    visual: {
      horizonRadius: 13,
      diskInner: 14.3,
      diskOuter: 52,
      inclination: 0.94,
      colorHot: "#ffe7b0",
      colorCool: "#e8a23a",
      spin: 0.6,
      doppler: 0.5,
      brightness: 1.2,
      halo: true,
      jet: false,
      jetColor: "#ffd9a0",
      jetLength: 60,
      overview: 150,
    },
  },
];

export function findBlackHole(id: string | null): BlackHole | undefined {
  if (!id) return undefined;
  return BLACK_HOLES.find((b) => b.id === id);
}

export function getBlackHoleOverview(id: string): number | undefined {
  return findBlackHole(id)?.visual.overview;
}

export interface BlackHoleMenuItem {
  id: string;
  name: string;
  categoryLabel: string;
  distanceLy: string;
  mass: string;
  tagline: string;
}

export const BLACKHOLE_MENU: BlackHoleMenuItem[] = BLACK_HOLES.map((b) => ({
  id: b.id,
  name: b.name,
  categoryLabel: b.categoryLabel,
  distanceLy: b.distanceLy,
  mass: b.mass,
  tagline: b.tagline,
}));
