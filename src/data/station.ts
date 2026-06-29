export const SPACE_STATION = {
  id: "station",
  name: "星际空间站",
  nameEn: "Orbital Station",
  radius: 0.48,
  color: "#5fd4ff",
  parentId: "mars",
  description:
    "火星轨道上的大型空间站，承担火星补给中转、科研观测与深空任务协调。太阳能阵列与对接环持续运转，舱室灯火通明。",
  facts: [
    { k: "轨道高度", v: "火星轨道 MO" },
    { k: "母星", v: "火星" },
    { k: "状态", v: "运行中 · 全系统在线" },
    { k: "职能", v: "补给 · 科研 · 深空中转" },
  ],
} as const;

export function findStation(id: string | null) {
  if (id === SPACE_STATION.id) return SPACE_STATION;
  return undefined;
}
