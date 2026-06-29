# 太阳系 · Solar System · 太陽系

Interactive 3D solar system built with React + Three.js.

**Languages:** [中文](#中文) · [English](#english) · [日本語](#日本語)

---

## 中文

用 React + Three.js 打造的交互式 3D 太阳系。写实贴图与程序化材质结合，配合 Bloom 泛光、大气辉光、曲速跃迁与多语言界面，可从太阳系漫游到系外行星与黑洞场景。

### 预览

**太阳系总览** — 拖拽旋转、滚轮缩放，一览太阳、八大行星轨道、小行星带与黄道星座。

![太阳系总览 — 总览视角、星座与轨道](pic/solar-overview.png)

**地球与星舰** — 点击天体打开信息面板，查看中文/英文/日文介绍；「秋风之敦号」星舰可在行星间巡航，并支持驾驶舱与追尾视角。

![地球详情 — 信息面板、星舰与系外信标](pic/earth-starship.png)

### 功能

- 🌞 **太阳**：着色器流动表面 + 多层日冕辉光
- 🪐 **八大行星**：公转 / 自转、真实自转轴倾角、土星环与天王星环
- 🌍 **地球**：云层、夜侧灯光与大气辉光
- 🌙 **卫星**：月球及主要天然卫星绕行星运转
- ☄️ **小天体**：小行星带、柯伊伯带、彗星
- ✨ **星座**：黄道十二星座连线与标签
- 🚀 **星舰**：GLB 模型、航线巡航、环绕轨道、驾驶舱 HUD
- 🛰 **空间站**：火星轨道运行，带 glow / 粒子效果
- 🌌 **曲速跃迁**：切换至 5 个多行星系外系统或 6 颗著名黑洞独立场景
- 🕳 **黑洞**：吸积盘 shader、引力透镜、喷流、多普勒明暗
- 🌐 **多语言**：中文 / English / 日本語 UI 切换（偏好写入 localStorage）
- 🖱️ **交互**：点击飞入、轨道视角、左侧天体目录、底部控制条

### 运行

```bash
npm install
npm run dev      # http://localhost:5405
npm run build    # 生产构建
npm run preview  # 预览生产构建
```

需要 Node 18+。

### 技术栈

- **Vite + React 18 + TypeScript**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing**（Bloom）
- **Zustand**（状态管理）
- **GSAP**（相机与曲速动画）

### 贴图与模型

- 行星表面可使用 `public/textures/` 中的真实贴图，或由 `src/utils/textures.ts` 程序化生成
- 星舰 / 空间站 GLB 模型位于 `public/models/`

### Bloom 开关说明

Bloom 在部分 Windows / ANGLE 组合下可能黑屏（已设 `multisampling={0}`）。底部控制条可关闭 Bloom，日冕、大气、轨道发光仍保留。

---

## English

An interactive 3D solar system built with React and Three.js. Realistic textures meet procedural materials, with bloom, atmospheric glow, warp travel, and a trilingual UI — explore the solar system, exoplanet systems, and famous black holes.

### Preview

**Solar System overview** — Drag to rotate, scroll to zoom. See the Sun, planetary orbits, asteroid belt, and zodiac constellations at a glance.

![Solar system overview — orbits and constellations](pic/solar-overview.png)

**Earth & starship** — Click any body to open the info panel (Chinese / English / Japanese). The starship *Autumn Wind* cruises between planets with chase and cockpit cameras.

![Earth detail — info panel, starship, and exo beacons](pic/earth-starship.png)

### Features

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

### Getting started

```bash
npm install
npm run dev      # http://localhost:5405
npm run build    # production build
npm run preview  # preview production build
```

Requires Node 18+.

### Tech stack

- **Vite + React 18 + TypeScript**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing** (Bloom)
- **Zustand** (state)
- **GSAP** (camera and warp animation)

### Textures & models

- Planet surfaces: real textures in `public/textures/`, or procedural maps in `src/utils/textures.ts`
- Starship and station GLB models in `public/models/`

### Bloom toggle

On some Windows / ANGLE setups, Bloom can cause a black screen (`multisampling={0}` mitigates this). Use the control bar to turn Bloom off; corona, atmosphere, and orbit glow remain.

---

## 日本語

React + Three.js で構築したインタラクティブ 3D 太陽系です。リアルテクスチャとプロシージャル素材、Bloom、大気グロー、ワープ移動、多言語 UI により、太陽系から系外惑星系・ブラックホールまで探索できます。

### プレビュー

**太陽系全体** — ドラッグで回転、スクロールでズーム。太陽、惑星軌道、小惑星帯、黄道星座を一覧できます。

![太陽系全体 — 軌道と星座](pic/solar-overview.png)

**地球と星艦** — 天体をクリックすると情報パネル（中 / EN / 日）が開きます。「秋風之敦号」は惑星間を航行し、追尾・コックピット視点に対応しています。

![地球詳細 — 情報パネル、星艦、系外ビーコン](pic/earth-starship.png)

### 機能

- 🌞 **太陽** — シェーダー表面と多層コロナ
- 🪐 **8大惑星** — 公転・自転、自転軸傾斜、土星・天王星の環
- 🌍 **地球** — 雲、夜側の灯り、大気グロー
- 🌙 **衛星** — 月と主要な天然衛星
- ☄️ **小天体** — 小惑星帯、カイパーベルト、彗星
- ✨ **星座** — 黄道12星座の線とラベル
- 🚀 **星艦** — GLB モデル、航路航行、周回軌道、コックピット HUD
- 🛰 **宇宙ステーション** — 火星軌道、glow / パーティクル効果
- 🌌 **ワープ** — 5つの多惑星系外系、6つのブラックホールシーンへ移動
- 🕳 **ブラックホール** — 降着円盤 shader、レンズ効果、ジェット、ドップラー
- 🌐 **多言語** — 中文 / English / 日本語（`localStorage` に保存）
- 🖱️ **操作** — 接近カメラ、軌道視点、左サイドバー、下部コントロール

### セットアップ

```bash
npm install
npm run dev      # http://localhost:5405
npm run build    # 本番ビルド
npm run preview  # ビルドのプレビュー
```

Node 18 以上が必要です。

### 技術スタック

- **Vite + React 18 + TypeScript**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing**（Bloom）
- **Zustand**（状態管理）
- **GSAP**（カメラ・ワープアニメーション）

### テクスチャとモデル

- 惑星表面：`public/textures/` の実テクスチャ、または `src/utils/textures.ts` のプロシージャル生成
- 星艦 / ステーション GLB：`public/models/`

### Bloom について

Windows / ANGLE 環境では Bloom で画面が真っ黒になる場合があります（`multisampling={0}` で緩和）。下部バーで Bloom をオフにできます。コロナ・大気・軌道の発光は残ります。

---

## Project structure / 目录结构 / プロジェクト構成

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
