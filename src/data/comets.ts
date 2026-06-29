export interface CometData {
  id: string;
  name: string;
  nameEn: string;
  designation: string;
  // Visual orbit in scene units (artistically scaled from real AU).
  semiMajor: number;
  semiMinor: number;
  inclination: number; // degrees
  ascendingNode?: number; // longitude of ascending node, degrees
  orbitalPeriod: number; // relative to Earth (1.0 = 1 year)
  color: string;
  nucleusRadius: number;
  description: string;
  facts: { k: string; v: string }[];
}

// 1P/Halley — real orbital elements, visually scaled to fit the scene.
// Real: a=17.834 AU, e≈0.967, i=162.26°, period≈75.32 yr,
// perihelion≈0.586 AU, aphelion≈35.08 AU.
// Visual perihelion ~18 (inside Mercury), aphelion ~158 (beyond Neptune).
export const HALLEY: CometData = {
  id: "halley",
  name: "哈雷彗星",
  nameEn: "Halley's Comet",
  designation: "1P/Halley",
  semiMajor: 88,
  semiMinor: 53.4,
  inclination: 162.26,
  ascendingNode: 58.42,
  // Visual animation period (real period 75.32 yr is in facts).
  orbitalPeriod: 14,
  color: "#c8e8ff",
  nucleusRadius: 0.35,
  description:
    "最著名的周期彗星，每约 75 年回归一次。公元前 240 年即有文字记载，以英国天文学家埃德蒙·哈雷命名。1986 年最近一次过近日点，2061 年将再次接近太阳。",
  facts: [
    { k: "编号", v: "1P/Halley" },
    { k: "公转周期", v: "约 75.3 年" },
    { k: "近日点", v: "0.586 AU" },
    { k: "远日点", v: "35.1 AU" },
    { k: "轨道倾角", v: "162.3°（逆行）" },
    { k: "上次回归", v: "1986 年 2 月" },
    { k: "下次回归", v: "2061 年 7 月" },
  ],
};

export const COMETS: CometData[] = [HALLEY];

export function findComet(id: string | null): CometData | undefined {
  if (!id) return undefined;
  return COMETS.find((c) => c.id === id);
}
