import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Scene } from "./scene/Scene";
import { InfoPanel } from "./components/InfoPanel";
import { SystemCard } from "./components/SystemCard";
import { ShipPanel } from "./components/ShipPanel";
import { CockpitOverlay } from "./components/CockpitOverlay";
import { ConstellationPanel } from "./components/ConstellationPanel";
import { Sidebar } from "./components/Sidebar";
import { SystemSwitcher } from "./components/SystemSwitcher";
import { WarpOverlay } from "./components/WarpOverlay";
import { ControlBar } from "./components/ControlBar";
import { Loader } from "./components/Loader";
import { LanguageSwitcher, useT } from "./i18n";
import { useStore } from "./store/useStore";

export default function App() {
  const select = useStore((s) => s.select);
  const shipCam = useStore((s) => s.shipCam);
  const setShipCam = useStore((s) => s.setShipCam);
  const t = useT();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 70, 180], fov: 50, near: 0.1, far: 2000 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          onPointerMissed={() => select(null)}
        >
          <Scene />
        </Canvas>
      </Suspense>

      <div className="ui-layer">
        <div className="app-title">
          <div className="app-title-row">
            <h1>{t("app.title")}</h1>
            <LanguageSwitcher />
          </div>
          <p>{t("app.subtitle")}</p>
        </div>
        <SystemSwitcher />
        <Sidebar />
        <SystemCard />
        <InfoPanel />
        <ShipPanel />
        <ConstellationPanel />
        <ControlBar />
        <div className="hint">{t("app.hint")}</div>
      </div>

      <CockpitOverlay />

      {shipCam !== "none" && (
        <button className="ship-exit-btn" onClick={() => setShipCam("none")}>
          {shipCam === "cockpit" ? t("ship.exitCockpit") : t("ship.exitChase")}
        </button>
      )}

      <WarpOverlay />
    </>
  );
}
