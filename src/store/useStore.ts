import { create } from "zustand";
import type { Locale } from "../i18n/types";

const LOCALE_KEY = "moli-locale";

function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved === "zh" || saved === "en" || saved === "ja") return saved;
  } catch {
    /* ignore */
  }
  return "zh";
}

interface State {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  // Active star system id: "solar" or an exoplanet system id.
  activeSystem: string;
  // System whose briefing card is shown; may differ from activeSystem before warp.
  targetSystem: string | null;
  // Warp (deep-space travel) transition in progress.
  warping: boolean;
  warpTo: string | null;
  selectedId: string | null;
  hoveredId: string | null;
  // When set, the camera flies to a close cinematic "orbit" view of this body.
  orbitId: string | null;
  // Zodiac constellations
  showConstellations: boolean;
  selectedConstellation: string | null;
  hoveredConstellation: string | null;
  timeScale: number;
  paused: boolean;
  showOrbits: boolean;
  bloom: boolean;
  // Spaceship: a controllable craft that flies between bodies.
  shipTarget: string; // body it currently orbits / is parked at
  shipDest: string | null; // destination while cruising (null = arrived)
  shipCam: "none" | "cockpit" | "chase"; // active ship camera mode
  shipSpeed: number; // telemetry: current speed (units/s)
  shipDist: number; // telemetry: distance to focus body
  launchShip: (id: string) => void;
  arriveShip: () => void;
  setShipCam: (mode: "none" | "cockpit" | "chase") => void;
  setTelemetry: (speed: number, dist: number) => void;
  select: (id: string | null) => void;
  // Click on a 3D body: while already in an orbit view, hop straight into the
  // new body's orbit view; otherwise just select it.
  clickBody: (id: string) => void;
  enterOrbit: (id: string) => void;
  exitOrbit: () => void;
  hover: (id: string | null) => void;
  toggleConstellations: () => void;
  selectConstellation: (id: string | null) => void;
  hoverConstellation: (id: string | null) => void;
  setSystem: (id: string) => void;
  // Open a system briefing without traveling yet.
  selectSystem: (id: string | null) => void;
  // Deep-space travel: play a warp animation, swap the scene mid-flight.
  startWarp: (id: string) => void;
  setTimeScale: (v: number) => void;
  togglePaused: () => void;
  toggleOrbits: () => void;
  toggleBloom: () => void;
}

export const useStore = create<State>((set, get) => ({
  locale: loadLocale(),
  setLocale: (locale) => {
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch {
      /* ignore */
    }
    set({ locale });
  },
  activeSystem: "solar",
  targetSystem: null,
  warping: false,
  warpTo: null,
  selectedId: null,
  hoveredId: null,
  orbitId: null,
  showConstellations: true,
  selectedConstellation: null,
  hoveredConstellation: null,
  timeScale: 1,
  paused: false,
  showOrbits: true,
  bloom: false,
  shipTarget: "earth",
  shipDest: null,
  shipCam: "none",
  shipSpeed: 0,
  shipDist: 0,
  launchShip: (id) =>
    set((s) => (id === s.shipTarget && !s.shipDest ? {} : { shipDest: id })),
  arriveShip: () =>
    set((s) => (s.shipDest ? { shipTarget: s.shipDest, shipDest: null } : {})),
  setShipCam: (mode) => set({ shipCam: mode }),
  setTelemetry: (speed, dist) => set({ shipSpeed: speed, shipDist: dist }),
  select: (id) =>
    set({ selectedId: id, orbitId: null, selectedConstellation: null }),
  clickBody: (id) =>
    set((s) => ({
      selectedId: id,
      orbitId: s.orbitId ? id : null,
      selectedConstellation: null,
    })),
  enterOrbit: (id) =>
    set({ selectedId: id, orbitId: id, selectedConstellation: null }),
  exitOrbit: () => set({ orbitId: null }),
  hover: (id) => set({ hoveredId: id }),
  toggleConstellations: () =>
    set((s) => ({ showConstellations: !s.showConstellations })),
  selectConstellation: (id) =>
    set(id ? { selectedConstellation: id, selectedId: null, orbitId: null } : { selectedConstellation: null }),
  hoverConstellation: (id) => set({ hoveredConstellation: id }),
  setSystem: (id) =>
    set({
      activeSystem: id,
      targetSystem: id === "solar" ? null : id,
      selectedId: null,
      orbitId: null,
      hoveredId: null,
      selectedConstellation: null,
      shipCam: "none",
    }),
  selectSystem: (id) =>
    set({
      targetSystem: id,
      selectedId: null,
      orbitId: null,
      hoveredId: null,
      selectedConstellation: null,
    }),
  startWarp: (id) => {
    if (get().warping || get().activeSystem === id) return;
    set({ warping: true, warpTo: id, targetSystem: id === "solar" ? null : id });
    // Swap the scene behind the opaque peak of the warp flash.
    window.setTimeout(() => get().setSystem(id), 720);
    // Let the streaks decelerate and fade to reveal the destination.
    window.setTimeout(() => set({ warping: false, warpTo: null }), 1700);
  },
  setTimeScale: (v) => set({ timeScale: v }),
  togglePaused: () => set((s) => ({ paused: !s.paused })),
  toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),
  toggleBloom: () => set((s) => ({ bloom: !s.bloom })),
}));
