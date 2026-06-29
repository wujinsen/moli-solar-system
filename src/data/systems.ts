export type ExoTexStyle = "rocky" | "earth" | "gas" | "ice";

export interface ExoPlanet {
  id: string;
  name: string;
  nameEn: string;
  radius: number;
  distance: number; // scene units from the star
  baseColor: string;
  secondaryColor: string;
  textureStyle: ExoTexStyle;
  habitable?: boolean;
  candidate?: boolean; // unconfirmed / candidate planet
  atmosphere?: { color: string; intensity: number };
  description: string;
  facts: { k: string; v: string }[];
}

export interface ExoStar {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  radius: number;
  color: string;
  glowColor: string;
  pulsar?: boolean;
  description: string;
  facts: { k: string; v: string }[];
}

export interface StarSystem {
  id: string;
  name: string;
  nameEn: string;
  distanceLy: string;
  distanceLyNum: number; // numeric light-years, for beacon placement
  starType: string;
  tagline: string;
  star: ExoStar;
  planets: ExoPlanet[];
  habitableZone?: { inner: number; outer: number };
  description: string;
  facts: { k: string; v: string }[];
}

export const EXO_SYSTEMS: StarSystem[] = [
  {
    id: "kepler90",
    name: "开普勒-90",
    nameEn: "Kepler-90",
    distanceLy: "约 2540 光年",
    distanceLyNum: 2540,
    starType: "G 型黄矮星",
    tagline: "数量之王 · 8 颗行星",
    description:
      "银河系中唯一在行星数量上与太阳系平起平坐的系统，由谷歌的 AI 神经网络从海量数据中“淘”出第 8 颗行星。内侧岩石、外侧气态，8 颗行星全部挤在约 1 AU 内，堪称宇宙最“内卷”的大家庭。",
    facts: [
      { k: "距离", v: "约 2540 光年" },
      { k: "恒星", v: "G 型黄矮星" },
      { k: "行星数", v: "8 颗" },
      { k: "发现方式", v: "开普勒 + AI" },
    ],
    star: {
      id: "kepler90-star",
      name: "开普勒-90",
      nameEn: "Kepler-90",
      type: "G 型黄矮星",
      radius: 7,
      color: "#ffd98a",
      glowColor: "#ffb347",
      description: "一颗比太阳略大、略热的 G 型黄矮星，统御着 8 颗紧密排列的行星。",
      facts: [
        { k: "光谱型", v: "G0V" },
        { k: "半径", v: "约 1.2 太阳" },
        { k: "行星数", v: "8 颗" },
      ],
    },
    planets: [
      {
        id: "kepler90b", name: "开普勒-90b", nameEn: "Kepler-90b", radius: 0.6, distance: 9,
        baseColor: "#c8a98a", secondaryColor: "#6e5743", textureStyle: "rocky",
        description: "最内侧的超级地球，表面被恒星烤得灼热。",
        facts: [{ k: "类型", v: "超级地球" }, { k: "公转", v: "约 7 天" }],
      },
      {
        id: "kepler90c", name: "开普勒-90c", nameEn: "Kepler-90c", radius: 0.55, distance: 12,
        baseColor: "#b89a7d", secondaryColor: "#5e4a38", textureStyle: "rocky",
        description: "炽热的岩石行星，与 b 几乎比邻。",
        facts: [{ k: "类型", v: "岩石行星" }, { k: "公转", v: "约 8.7 天" }],
      },
      {
        id: "kepler90i", name: "开普勒-90i", nameEn: "Kepler-90i", radius: 0.48, distance: 15,
        baseColor: "#d2b48c", secondaryColor: "#7a5c3a", textureStyle: "rocky",
        description: "由 AI 神经网络发现的第 8 颗行星，让本系统追平太阳系。",
        facts: [{ k: "身份", v: "AI 发现" }, { k: "公转", v: "约 14.4 天" }],
      },
      {
        id: "kepler90d", name: "开普勒-90d", nameEn: "Kepler-90d", radius: 1.2, distance: 19,
        baseColor: "#cdbb95", secondaryColor: "#8a7350", textureStyle: "ice",
        description: "迷你海王星，过渡带上的中型行星。",
        facts: [{ k: "类型", v: "迷你海王星" }, { k: "公转", v: "约 60 天" }],
      },
      {
        id: "kepler90e", name: "开普勒-90e", nameEn: "Kepler-90e", radius: 1.1, distance: 24,
        baseColor: "#bcd0d6", secondaryColor: "#6f939c", textureStyle: "ice",
        description: "中型行星，开始向气态过渡。",
        facts: [{ k: "类型", v: "迷你海王星" }, { k: "公转", v: "约 92 天" }],
      },
      {
        id: "kepler90f", name: "开普勒-90f", nameEn: "Kepler-90f", radius: 1.2, distance: 30,
        baseColor: "#c7c0a8", secondaryColor: "#8a8160", textureStyle: "ice",
        description: "本系统中部的冷行星。",
        facts: [{ k: "类型", v: "迷你海王星" }, { k: "公转", v: "约 125 天" }],
      },
      {
        id: "kepler90g", name: "开普勒-90g", nameEn: "Kepler-90g", radius: 2.2, distance: 38,
        baseColor: "#d8b48a", secondaryColor: "#9c6b43", textureStyle: "gas",
        atmosphere: { color: "#e8cba0", intensity: 0.6 },
        description: "气态行星，体型显著增大。",
        facts: [{ k: "类型", v: "气态行星" }, { k: "公转", v: "约 211 天" }],
      },
      {
        id: "kepler90h", name: "开普勒-90h", nameEn: "Kepler-90h", radius: 2.8, distance: 48,
        baseColor: "#e0c089", secondaryColor: "#a8804a", textureStyle: "gas",
        atmosphere: { color: "#f0d6a4", intensity: 0.7 },
        description: "最外侧的气态巨行星，位置恰好与地球到太阳的距离相当。",
        facts: [{ k: "类型", v: "气态巨行星" }, { k: "公转", v: "约 331 天" }],
      },
    ],
  },
  {
    id: "hd10180",
    name: "HD 10180",
    nameEn: "HD 10180",
    distanceLy: "约 127 光年",
    distanceLyNum: 127,
    starType: "G 型黄矮星（似太阳）",
    tagline: "潜在多子之王 · 7（可能 9）颗",
    description:
      "母恒星是一颗与太阳高度相似的黄矮星，已百分百确认 7 颗行星，后续数据暗示可能还隐藏着另外 2 颗。若一旦证实，它将以 9 颗行星超越太阳系，成为银河系真正的“多子之王”。",
    facts: [
      { k: "距离", v: "约 127 光年" },
      { k: "恒星", v: "G 型黄矮星" },
      { k: "已确认", v: "7 颗" },
      { k: "或多达", v: "9 颗" },
    ],
    star: {
      id: "hd10180-star",
      name: "HD 10180",
      nameEn: "HD 10180",
      type: "G 型黄矮星",
      radius: 7,
      color: "#ffe2a0",
      glowColor: "#ffc966",
      description: "与太阳极为相似的黄矮星，是搜寻“太阳系翻版”的重点目标。",
      facts: [
        { k: "光谱型", v: "G1V" },
        { k: "似太阳", v: "极高" },
        { k: "行星数", v: "7~9 颗" },
      ],
    },
    planets: [
      {
        id: "hd10180b", name: "HD 10180 b", nameEn: "HD 10180 b", radius: 0.7, distance: 7,
        baseColor: "#caa882", secondaryColor: "#6e553a", textureStyle: "rocky", candidate: true,
        description: "极内侧的候选行星，灼热而未完全确认。",
        facts: [{ k: "状态", v: "候选" }, { k: "公转", v: "约 1.2 天" }],
      },
      {
        id: "hd10180c", name: "HD 10180 c", nameEn: "HD 10180 c", radius: 1.3, distance: 11,
        baseColor: "#c9b79a", secondaryColor: "#897152", textureStyle: "ice",
        description: "已确认的内侧海王星级行星。",
        facts: [{ k: "类型", v: "海王星级" }, { k: "公转", v: "约 5.8 天" }],
      },
      {
        id: "hd10180d", name: "HD 10180 d", nameEn: "HD 10180 d", radius: 1.2, distance: 15,
        baseColor: "#bcd0d6", secondaryColor: "#6f939c", textureStyle: "ice",
        description: "确认行星，质量约为地球的 12 倍。",
        facts: [{ k: "类型", v: "海王星级" }, { k: "公转", v: "约 16 天" }],
      },
      {
        id: "hd10180e", name: "HD 10180 e", nameEn: "HD 10180 e", radius: 1.4, distance: 20,
        baseColor: "#c7c0a8", secondaryColor: "#8a8160", textureStyle: "ice",
        description: "确认行星，中等距离的冰巨星。",
        facts: [{ k: "类型", v: "海王星级" }, { k: "公转", v: "约 50 天" }],
      },
      {
        id: "hd10180f", name: "HD 10180 f", nameEn: "HD 10180 f", radius: 1.5, distance: 27,
        baseColor: "#b7c8d0", secondaryColor: "#67868f", textureStyle: "ice",
        description: "确认行星，渐入系统的温和地带。",
        facts: [{ k: "类型", v: "海王星级" }, { k: "公转", v: "约 122 天" }],
      },
      {
        id: "hd10180g", name: "HD 10180 g", nameEn: "HD 10180 g", radius: 1.5, distance: 36,
        baseColor: "#aebfe0", secondaryColor: "#5e6f9c", textureStyle: "ice",
        description: "确认行星，位于较冷的外侧区域。",
        facts: [{ k: "类型", v: "海王星级" }, { k: "公转", v: "约 600 天" }],
      },
      {
        id: "hd10180h", name: "HD 10180 h", nameEn: "HD 10180 h", radius: 1.8, distance: 46,
        baseColor: "#9fb4d8", secondaryColor: "#566a9c", textureStyle: "ice",
        description: "已确认的最外侧行星，公转周期长达数年。",
        facts: [{ k: "类型", v: "海王星级" }, { k: "公转", v: "约 2200 天" }],
      },
      {
        id: "hd10180i", name: "HD 10180 i", nameEn: "HD 10180 i", radius: 0.9, distance: 58,
        baseColor: "#9aa6c0", secondaryColor: "#4e5a78", textureStyle: "ice", candidate: true,
        description: "未确认的候选行星之一——若证实，本系统将达 8 颗。",
        facts: [{ k: "状态", v: "候选" }, { k: "意义", v: "或第 8 颗" }],
      },
    ],
  },
  {
    id: "trappist1",
    name: "TRAPPIST-1",
    nameEn: "TRAPPIST-1",
    distanceLy: "约 40 光年",
    distanceLyNum: 40,
    starType: "M 型红矮星",
    tagline: "宜居批发商 · 7 颗类地",
    description:
      "全银河系最受瞩目的系统。虽是暗弱的红矮星，却带着 7 颗与地球差不多大的岩石行星，其中 e、f、g 三颗同时挤在温和的宜居带内。詹姆斯·韦伯望远镜正对准这里疯狂解析它们的大气层，搜寻生命的迹象。",
    habitableZone: { inner: 11.5, outer: 17.5 },
    facts: [
      { k: "距离", v: "约 40 光年" },
      { k: "恒星", v: "M 型红矮星" },
      { k: "行星数", v: "7 颗（全岩石）" },
      { k: "宜居带", v: "e / f / g" },
    ],
    star: {
      id: "trappist1-star",
      name: "TRAPPIST-1",
      nameEn: "TRAPPIST-1",
      type: "M 型红矮星（超冷矮星）",
      radius: 3.2,
      color: "#ff6a3d",
      glowColor: "#ff4d2e",
      description: "一颗仅比木星略大的超冷红矮星，温度低、寿命极长，却拥有 7 颗类地行星。",
      facts: [
        { k: "光谱型", v: "M8V" },
        { k: "半径", v: "约 0.12 太阳" },
        { k: "宜居行星", v: "3 颗" },
      ],
    },
    planets: [
      {
        id: "trappist1b", name: "TRAPPIST-1b", nameEn: "TRAPPIST-1b", radius: 0.6, distance: 6,
        baseColor: "#b06a4a", secondaryColor: "#6e3a26", textureStyle: "rocky",
        description: "最内侧的炽热岩石行星，朝向恒星一面或为熔岩。",
        facts: [{ k: "类型", v: "岩石行星" }, { k: "公转", v: "约 1.5 天" }],
      },
      {
        id: "trappist1c", name: "TRAPPIST-1c", nameEn: "TRAPPIST-1c", radius: 0.6, distance: 8,
        baseColor: "#bd7a55", secondaryColor: "#73402a", textureStyle: "rocky",
        description: "炽热的类金星岩石世界。",
        facts: [{ k: "类型", v: "岩石行星" }, { k: "公转", v: "约 2.4 天" }],
      },
      {
        id: "trappist1d", name: "TRAPPIST-1d", nameEn: "TRAPPIST-1d", radius: 0.5, distance: 10,
        baseColor: "#c89a78", secondaryColor: "#7a5638", textureStyle: "rocky",
        description: "宜居带内缘的小型行星，可能有水汽。",
        facts: [{ k: "类型", v: "岩石行星" }, { k: "公转", v: "约 4.0 天" }],
      },
      {
        id: "trappist1e", name: "TRAPPIST-1e", nameEn: "TRAPPIST-1e", radius: 0.55, distance: 12.5,
        baseColor: "#4a8fb0", secondaryColor: "#2f6f7a", textureStyle: "earth", habitable: true,
        atmosphere: { color: "#6fd6a0", intensity: 1.0 },
        description: "宜居带核心，被认为最可能拥有液态水，是搜寻生命的头号目标。",
        facts: [{ k: "身份", v: "宜居带 · 最佳" }, { k: "公转", v: "约 6.1 天" }],
      },
      {
        id: "trappist1f", name: "TRAPPIST-1f", nameEn: "TRAPPIST-1f", radius: 0.6, distance: 15,
        baseColor: "#4f97a8", secondaryColor: "#2f6f78", textureStyle: "earth", habitable: true,
        atmosphere: { color: "#6fd6a0", intensity: 1.0 },
        description: "宜居带内的水世界候选，可能覆盖着海洋或冰层。",
        facts: [{ k: "身份", v: "宜居带" }, { k: "公转", v: "约 9.2 天" }],
      },
      {
        id: "trappist1g", name: "TRAPPIST-1g", nameEn: "TRAPPIST-1g", radius: 0.65, distance: 17.5,
        baseColor: "#5a93b8", secondaryColor: "#34657f", textureStyle: "earth", habitable: true,
        atmosphere: { color: "#7fc6e0", intensity: 1.0 },
        description: "宜居带外缘最大的一颗，或为冰雪覆盖的海洋世界。",
        facts: [{ k: "身份", v: "宜居带" }, { k: "公转", v: "约 12.4 天" }],
      },
      {
        id: "trappist1h", name: "TRAPPIST-1h", nameEn: "TRAPPIST-1h", radius: 0.45, distance: 21,
        baseColor: "#9fb0c0", secondaryColor: "#5a6b7a", textureStyle: "ice",
        description: "最外侧的寒冷小行星，温度极低。",
        facts: [{ k: "类型", v: "冰冻行星" }, { k: "公转", v: "约 18.8 天" }],
      },
    ],
  },
  {
    id: "hr8799",
    name: "HR 8799",
    nameEn: "HR 8799",
    distanceLy: "约 129 光年",
    distanceLyNum: 129,
    starType: "A 型主序星",
    tagline: "视觉震撼 · 4 颗巨行星合影",
    description:
      "极其罕见——它的 4 颗行星体型巨大（均为木星质量数倍）且远离恒星，天文学家竟用望远镜“直接拍摄”到了它们绕恒星运转的真实照片与动态视频，这在天文学史上具有里程碑意义。",
    facts: [
      { k: "距离", v: "约 129 光年" },
      { k: "恒星", v: "A 型主序星" },
      { k: "行星数", v: "4 颗巨行星" },
      { k: "成就", v: "直接成像" },
    ],
    star: {
      id: "hr8799-star",
      name: "HR 8799",
      nameEn: "HR 8799",
      type: "A 型主序星",
      radius: 6.5,
      color: "#cfe0ff",
      glowColor: "#9bc0ff",
      description: "一颗年轻而炽热的蓝白色 A 型恒星，年龄仅约 3000 万年。",
      facts: [
        { k: "光谱型", v: "A5V" },
        { k: "年龄", v: "约 3000 万年" },
        { k: "巨行星", v: "4 颗" },
      ],
    },
    planets: [
      {
        id: "hr8799e", name: "HR 8799 e", nameEn: "HR 8799 e", radius: 2.6, distance: 24,
        baseColor: "#c08a5a", secondaryColor: "#6e4a2a", textureStyle: "gas",
        atmosphere: { color: "#e0a060", intensity: 0.7 },
        description: "最内侧的巨行星，约 7~10 倍木星质量，仍因年轻而炽热发红。",
        facts: [{ k: "质量", v: "约 7~10 木星" }, { k: "成像", v: "已直接拍摄" }],
      },
      {
        id: "hr8799d", name: "HR 8799 d", nameEn: "HR 8799 d", radius: 2.8, distance: 40,
        baseColor: "#c8925f", secondaryColor: "#74502c", textureStyle: "gas",
        atmosphere: { color: "#e8a868", intensity: 0.7 },
        description: "约 7~10 倍木星质量的炽热巨行星。",
        facts: [{ k: "质量", v: "约 7~10 木星" }, { k: "成像", v: "已直接拍摄" }],
      },
      {
        id: "hr8799c", name: "HR 8799 c", nameEn: "HR 8799 c", radius: 2.9, distance: 60,
        baseColor: "#cf9a64", secondaryColor: "#7a5430", textureStyle: "gas",
        atmosphere: { color: "#f0b070", intensity: 0.7 },
        description: "光谱中探测到水与甲烷的巨行星。",
        facts: [{ k: "质量", v: "约 7~10 木星" }, { k: "大气", v: "水 / 甲烷" }],
      },
      {
        id: "hr8799b", name: "HR 8799 b", nameEn: "HR 8799 b", radius: 3.0, distance: 84,
        baseColor: "#d6a06a", secondaryColor: "#805834", textureStyle: "gas",
        atmosphere: { color: "#f4b878", intensity: 0.7 },
        description: "最外侧、质量稍小（约 5 倍木星）的巨行星。",
        facts: [{ k: "质量", v: "约 5 木星" }, { k: "成像", v: "已直接拍摄" }],
      },
    ],
  },
  {
    id: "psr1257",
    name: "PSR B1257+12",
    nameEn: "PSR B1257+12",
    distanceLy: "约 2300 光年",
    distanceLyNum: 2300,
    starType: "脉冲星（中子星）",
    tagline: "僵尸世界 · 人类首个系外系统",
    description:
      "人类历史上发现的第一个系外行星系统（1992 年）。中心不是恒星，而是一颗恒星死亡后留下的脉冲星——每秒旋转上万次、释放致命辐射的“死星”。在它周围竟存活着 3 颗“僵尸行星”，是宇宙中最荒凉恐怖的多行星系统。",
    facts: [
      { k: "距离", v: "约 2300 光年" },
      { k: "中心", v: "脉冲星（死星）" },
      { k: "行星数", v: "3 颗" },
      { k: "里程碑", v: "首个系外系统(1992)" },
    ],
    star: {
      id: "psr1257-star",
      name: "PSR B1257+12",
      nameEn: "PSR B1257+12",
      type: "毫秒脉冲星",
      radius: 1.4,
      color: "#bcd8ff",
      glowColor: "#7fa8ff",
      pulsar: true,
      description: "一颗高速自转的中子星，两极喷射出强烈的辐射束，像宇宙灯塔般扫过太空。",
      facts: [
        { k: "类型", v: "毫秒脉冲星" },
        { k: "自转", v: "约 161 次/秒" },
        { k: "本质", v: "恒星残骸" },
      ],
    },
    planets: [
      {
        id: "psr1257a", name: "PSR B1257+12 A", nameEn: "PSR B1257+12 A", radius: 0.35, distance: 7,
        baseColor: "#8a8f98", secondaryColor: "#4a4e55", textureStyle: "rocky",
        description: "质量仅约月球的 2 倍，是已知最小的系外行星之一。",
        facts: [{ k: "质量", v: "约 0.02 地球" }, { k: "公转", v: "约 25 天" }],
      },
      {
        id: "psr1257b", name: "PSR B1257+12 B", nameEn: "PSR B1257+12 B", radius: 0.7, distance: 12,
        baseColor: "#9a8f86", secondaryColor: "#544a42", textureStyle: "rocky",
        description: "约 4 倍地球质量的“僵尸行星”，沐浴在致命辐射中。",
        facts: [{ k: "质量", v: "约 4 地球" }, { k: "公转", v: "约 66 天" }],
      },
      {
        id: "psr1257c", name: "PSR B1257+12 C", nameEn: "PSR B1257+12 C", radius: 0.72, distance: 16,
        baseColor: "#90858f", secondaryColor: "#4a4250", textureStyle: "rocky",
        description: "另一颗约 4 倍地球质量的僵尸行星，与 B 互成共振。",
        facts: [{ k: "质量", v: "约 4 地球" }, { k: "公转", v: "约 98 天" }],
      },
    ],
  },
];

export function findSystem(id: string | null): StarSystem | undefined {
  if (!id) return undefined;
  return EXO_SYSTEMS.find((s) => s.id === id);
}

// Camera overview distance that frames the whole active system.
export function getSystemOverviewDistance(id: string): number {
  const s = findSystem(id);
  if (!s) return 200; // solar system default
  const outer = Math.max(...s.planets.map((p) => p.distance + p.radius));
  return Math.max(outer * 2.4, 40);
}

export function findExoPlanet(
  id: string | null
): { planet: ExoPlanet; system: StarSystem } | undefined {
  if (!id) return undefined;
  for (const system of EXO_SYSTEMS) {
    const planet = system.planets.find((p) => p.id === id);
    if (planet) return { planet, system };
  }
  return undefined;
}

export function findExoStar(
  id: string | null
): StarSystem | undefined {
  if (!id) return undefined;
  return EXO_SYSTEMS.find((s) => s.star.id === id);
}

// Menu entries: the Solar System plus every exoplanet system.
export interface SystemMenuItem {
  id: string;
  name: string;
  starType: string;
  planetCount: number;
  distanceLy: string;
  tagline: string;
}

export const SYSTEM_MENU: SystemMenuItem[] = [
  {
    id: "solar",
    name: "太阳系",
    starType: "G 型黄矮星",
    planetCount: 8,
    distanceLy: "我们的家园",
    tagline: "Solar System",
  },
  ...EXO_SYSTEMS.map((s) => ({
    id: s.id,
    name: s.name,
    starType: s.starType,
    planetCount: s.planets.filter((p) => !p.candidate).length,
    distanceLy: s.distanceLy,
    tagline: s.tagline,
  })),
];
