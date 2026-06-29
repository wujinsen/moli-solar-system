# Solar System (Interactive 3D)

**Docs:** [中文](README.md) · English · [日本語](README.ja.md)

An interactive 3D solar system built with React and Three.js. Realistic textures meet procedural materials, with bloom, atmospheric glow, warp travel, and a trilingual UI — explore the solar system, exoplanet systems, and famous black holes.

## Preview

### Solar System overview

Drag to rotate, scroll to zoom. See the Sun, planetary orbits, asteroid belt, and zodiac constellations at a glance.

![Solar system overview — orbits and constellations](pic/solar-overview.png)

### Earth & starship

Click any body to open the info panel (Chinese / English / Japanese). The starship *Autumn Wind* cruises between planets with chase and cockpit cameras.

![Earth detail — info panel, starship, and exo beacons](pic/earth-starship.png)

## Features

- 🌞 **Sun** — Animated shader surface and multi-layer corona
- 🪐 **Eight planets** — Orbit and spin with realistic axial tilts; Saturn and Uranus rings
- 🌍 **Earth** — Cloud layer, night lights, and atmospheric glow
- 🌙 **Moons** — The Moon and major natural satellites
- ☄️ **Small bodies** — Asteroid belt, Kuiper belt, comets
- ✨ **Constellations** — Zodiac lines and labels
- 🚀 **Starship** — GLB model, route flight, orbital parking, cockpit HUD
- 🛰 **Space station** — Mars orbit with glow and particle effects
- 🌌 **Warp travel** — Jump to 5 multi-planet exo systems or 6 black-hole scenes
- 🕳 **Black holes** — Accretion disk shader, lensing, jets, Doppler beaming
- 🌐 **i18n** — Chinese / English / Japanese UI (saved in `localStorage`)
- 🖱️ **Interaction** — Fly-in camera, orbit view, sidebar catalog, control bar

## Getting started

```bash
npm install
npm run dev      # http://localhost:5405
npm run build    # production build
npm run preview  # preview production build
```

Requires Node 18+.

## Tech stack

- **Vite + React 18 + TypeScript**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing** (Bloom)
- **Zustand** (state)
- **GSAP** (camera and warp animation)

## Textures & models

- Planet surfaces: real textures in `public/textures/`, or procedural maps in `src/utils/textures.ts`
- Starship and station GLB models in `public/models/`

## Bloom toggle

On some Windows / ANGLE setups, Bloom can cause a black screen (`multisampling={0}` mitigates this). Use the control bar to turn Bloom off; corona, atmosphere, and orbit glow remain.

## Project structure

```
src/
  data/           # Bodies, exo systems, black holes, zodiac data
  i18n/           # zh / en / ja strings and panel translations
  store/          # Zustand global state
  scene/          # 3D scene components
  components/     # UI: sidebar, info panels, controls
  utils/          # Procedural textures, helpers
pic/              # README screenshots
public/
  models/         # GLB models (starship, station)
  textures/       # Planet textures
```

## License

[MIT](LICENSE) © 2026 [wujinsen](https://github.com/wujinsen)
