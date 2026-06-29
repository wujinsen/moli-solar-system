# 太陽系 · Solar System (Interactive 3D)

**ドキュメント：** [中文](README.md) · [English](README.en.md) · 日本語

React + Three.js で構築したインタラクティブ 3D 太陽系です。リアルテクスチャとプロシージャル素材、Bloom、大気グロー、ワープ移動、多言語 UI により、太陽系から系外惑星系・ブラックホールまで探索できます。

## プレビュー

### 太陽系全体

ドラッグで回転、スクロールでズーム。太陽、惑星軌道、小惑星帯、黄道星座を一覧できます。

![太陽系全体 — 軌道と星座](pic/solar-overview.png)

### 地球と星艦

天体をクリックすると情報パネル（中 / EN / 日）が開きます。「秋風之敦号」は惑星間を航行し、追尾・コックピット視点に対応しています。

![地球詳細 — 情報パネル、星艦、系外ビーコン](pic/earth-starship.png)

## 機能

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

## セットアップ

```bash
npm install
npm run dev      # http://localhost:5405
npm run build    # 本番ビルド
npm run preview  # ビルドのプレビュー
```

Node 18 以上が必要です。

## 技術スタック

- **Vite + React 18 + TypeScript**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing**（Bloom）
- **Zustand**（状態管理）
- **GSAP**（カメラ・ワープアニメーション）

## テクスチャとモデル

- 惑星表面：`public/textures/` の実テクスチャ、または `src/utils/textures.ts` のプロシージャル生成
- 星艦 / ステーション GLB：`public/models/`

## Bloom について

Windows / ANGLE 環境では Bloom で画面が真っ黒になる場合があります（`multisampling={0}` で緩和）。下部バーで Bloom をオフにできます。コロナ・大気・軌道の発光は残ります。

## プロジェクト構成

```
src/
  data/           # 天体、系外系、ブラックホール、星座データ
  i18n/           # 中 / EN / 日 文案とパネル翻訳
  store/          # Zustand グローバル状態
  scene/          # 3D シーンコンポーネント
  components/     # UI：サイドバー、情報パネル、コントロール
  utils/          # プロシージャルテクスチャ等
pic/              # README スクリーンショット
public/
  models/         # GLB モデル
  textures/       # 惑星テクスチャ
```

## License

[MIT](LICENSE) © 2026 [wujinsen](https://github.com/wujinsen)
