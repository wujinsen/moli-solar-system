import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Starfield } from "./Starfield";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { AsteroidBelt } from "./AsteroidBelt";
import { KuiperBelt } from "./KuiperBelt";
import { Comet } from "./Comet";
import { Constellations } from "./Constellations";
import { ExoSystem } from "./ExoSystem";
import { BlackHole } from "./BlackHole";
import { SystemBeacons } from "./SystemBeacons";
import { Spaceship } from "./Spaceship";
import { SpaceStation } from "./SpaceStation";
import { CameraRig } from "./CameraRig";
import {
  ASTEROID_BELT,
  DWARF_PLANETS,
  KUIPER_BELT,
  PLANETS,
} from "../data/bodies";
import { HALLEY } from "../data/comets";
import { findSystem } from "../data/systems";
import { findBlackHole } from "../data/blackholes";
import { useStore } from "../store/useStore";

function SolarContent() {
  return (
    <>
      <Sun />
      {PLANETS.map((p) => (
        <Planet key={p.id} data={p} />
      ))}
      {DWARF_PLANETS.map((p) => (
        <Planet key={p.id} data={p} />
      ))}

      <AsteroidBelt inner={ASTEROID_BELT.inner} outer={ASTEROID_BELT.outer} />
      <KuiperBelt inner={KUIPER_BELT.inner} outer={KUIPER_BELT.outer} />
      <Comet data={HALLEY} />

      <Constellations />
      <SystemBeacons />
      <SpaceStation />
      <Spaceship />
    </>
  );
}

export function Scene() {
  const bloom = useStore((s) => s.bloom);
  const activeSystem = useStore((s) => s.activeSystem);
  const exo = findSystem(activeSystem);
  const blackHole = findBlackHole(activeSystem);

  return (
    <>
      <color attach="background" args={["#02030a"]} />
      <Starfield />

      {blackHole ? (
        <BlackHole data={blackHole} />
      ) : exo ? (
        <ExoSystem system={exo} />
      ) : (
        <SolarContent />
      )}

      <CameraRig />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={3}
        maxDistance={420}
      />

      {(bloom || blackHole) && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={blackHole ? 1.35 : 0.9}
            luminanceThreshold={blackHole ? 0.5 : 0.82}
            luminanceSmoothing={0.6}
            mipmapBlur
            radius={blackHole ? 0.75 : 0.6}
          />
        </EffectComposer>
      )}
    </>
  );
}
