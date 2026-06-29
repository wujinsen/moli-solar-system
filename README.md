# 太阳系 · Solar System (Interactive 3D)

用 React + Three.js 打造的炫酷太阳系可视化。**写实贴图打底 + 炫光特效点缀**的混合风格：真实的行星表面、物理光照，配合发光轨道、大气辉光、太阳日冕与 Bloom 泛光。

## 功能

- 🌞 **太阳**：着色器流动表面 + 多层日冕辉光 + 唯一点光源
- 🪐 **八大行星**：各自公转 + 自转，真实自转轴倾角（天王星“躺着转”、金星逆转）
- 🌍 **地球**：独立旋转的云层 + 蓝色大气辉光
- 💍 **土星环 / 天王星环**：半透明分层环带
- 🌙 **卫星**：月球、木卫一~四、土卫六、海卫一等绕行星运转
- ☄️ **小天体**：小行星带（实例化网格）、柯伊伯带（粒子）、矮行星冥王星、两颗带拖尾的彗星
- ✨ **特效**：Bloom 泛光 + ACES 色调映射 + Fresnel 大气辉光 + 发光轨道
- 🖱️ **交互**：
  - 拖拽旋转、滚轮缩放
  - 点击任意天体 → 相机平滑“飞入”并跟随其公转
  - 右侧信息面板展示中文介绍与数据
  - 底部控制条：播放/暂停、公转速度、显隐轨道、炫光开关、回到总览

## 运行

```bash
npm install
npm run dev      # 启动开发服务器 http://localhost:5173
npm run build    # 生产构建
npm run preview  # 预览生产构建
```

需要 Node 18+。

## 技术栈

- **Vite + React 18 + TypeScript**
- **Three.js** + **@react-three/fiber**（声明式 3D）
- **@react-three/drei**（OrbitControls / Stars / Html）
- **@react-three/postprocessing**（Bloom 泛光）
- **Zustand**（状态管理）

## 关于贴图

行星表面默认使用**程序化生成的贴图**（`src/utils/textures.ts` 中基于值噪声生成），无需任何外部素材即可运行。若想要更高的真实度，可将真实行星贴图放入 `public/textures/`，并在 `src/scene/Planet.tsx` 中改用 `useTexture` 加载。

## 关于“炫光（Bloom）”开关

Bloom 泛光后处理在个别 Windows / ANGLE 显卡组合下可能出现黑屏（已应用 `multisampling={0}` 规避）。底部控制条提供**“炫光 开/关”**按钮：默认开启；若你看到黑屏，点一下即可关闭后处理恢复画面，其余发光特效（日冕、大气、轨道）仍然保留。

## 目录结构

```
src/
  data/bodies.ts        # 所有天体参数（核心数据源）
  store/useStore.ts     # 全局状态（选中、时间、开关）
  utils/textures.ts     # 程序化贴图生成
  scene/                # 3D：太阳/行星/卫星/环/轨道/带/彗星/相机/后处理
  components/           # UI：信息面板 / 控制条 / 加载
  App.tsx               # Canvas + UI 布局
```
