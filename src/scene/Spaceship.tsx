import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { ShipLabel } from "./BodyLabel";
import * as THREE from "three";
import { useStore } from "../store/useStore";
import { getBodyRadius } from "../data/bodies";
import { makeThrusterTexture } from "../utils/textures";
import { getBodyObject, registerBody, unregisterBody } from "./registry";
import { ShipModel, type ShipLayout } from "./ShipModel";
import {
  applyOrbitPosition,
  buildFlightPathCurve,
  computeSeekAvoidingSun,
  type FlightPath,
  repelFromSun,
  sampleFlightPath,
  snapToOrbit,
} from "./shipRoute";

const SHIP_SPEED = 11;
const ORBIT_SPEED = 1.1;
const FORWARD = new THREE.Vector3(0, 0, 1);
const ORBIT_ARRIVE = 1.4;
const PATH_END_T = 0.998;

const DEFAULT_SHIP_LAYOUT: ShipLayout = {
  engineZ: -1.05,
  engineY: -0.12,
  engineSpread: 0.22,
  pickRadius: 1.3,
  labelY: 0.85,
};

function parkRadius(id: string): number {
  return getBodyRadius(id) * 2.4 + 1.2;
}

export function Spaceship() {
  const groupRef = useRef<THREE.Group>(null!);
  const anchorRef = useRef<THREE.Group>(null!);
  const thrusterLRef = useRef<THREE.Sprite>(null!);
  const thrusterRRef = useRef<THREE.Sprite>(null!);
  const plumeLRef = useRef<THREE.Mesh>(null!);
  const plumeRRef = useRef<THREE.Mesh>(null!);
  const [shipLayout, setShipLayout] = useState(DEFAULT_SHIP_LAYOUT);
  const onShipLayout = useCallback((layout: ShipLayout) => setShipLayout(layout), []);

  const shipCam = useStore((s) => s.shipCam);
  const hoveredId = useStore((s) => s.hoveredId);
  const selectedId = useStore((s) => s.selectedId);

  const thrusterTex = useMemo(makeThrusterTexture, []);
  const pos = useRef(new THREE.Vector3(34, 1, 0));
  const angle = useRef(0);
  const heading = useRef(new THREE.Vector3(0, 0, 1));
  const tmpTarget = useRef(new THREE.Vector3());
  const tmpSeek = useRef(new THREE.Vector3());
  const tmpDir = useRef(new THREE.Vector3());
  const tmpTan = useRef(new THREE.Vector3());
  const quat = useRef(new THREE.Quaternion());
  const teleAcc = useRef(0);
  const curSpeed = useRef(0);

  const flightCurve = useRef<FlightPath | null>(null);
  const pathT = useRef(0);
  const pathDone = useRef(true);
  const routeDest = useRef<string | null>(null);
  const finalApproachAngle = useRef<number | null>(null);
  const orbiting = useRef(true);
  const booted = useRef(false);
  const routePts = useRef<THREE.Vector3[]>([]);

  const routeGeom = useMemo(() => new THREE.BufferGeometry(), []);
  const routeLine = useMemo(() => {
    const mat = new THREE.LineDashedMaterial({
      color: "#7fd6ff",
      dashSize: 1.0,
      gapSize: 0.8,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const l = new THREE.Line(routeGeom, mat);
    l.frustumCulled = false;
    l.visible = false;
    return l;
  }, [routeGeom]);

  useEffect(() => {
    registerBody("ship", anchorRef.current);
    return () => unregisterBody("ship");
  }, []);

  function stepOrbit(shipTarget: string, step: number, timeScale: number) {
    const obj = getBodyObject(shipTarget);
    if (!obj) return false;
    obj.getWorldPosition(tmpTarget.current);
    angle.current += ORBIT_SPEED * step * Math.max(timeScale, 0.2);
    const r = parkRadius(shipTarget);
    applyOrbitPosition(pos.current, tmpTarget.current, r, angle.current);
    heading.current
      .set(-Math.sin(angle.current), 0, -Math.cos(angle.current))
      .normalize();
    curSpeed.current = ORBIT_SPEED * r * Math.max(timeScale, 0.2);
    return true;
  }

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;

    const { shipTarget, shipDest, paused, timeScale, arriveShip } =
      useStore.getState();

    const step = Math.min(dt, 0.05);
    const cruising = shipDest != null;
    const focus = cruising ? shipDest : shipTarget;
    const obj = focus ? getBodyObject(focus) : undefined;

    if (obj) obj.getWorldPosition(tmpTarget.current);

    if (!booted.current && !cruising) {
      if (stepOrbit(shipTarget, 0, timeScale)) booted.current = true;
    }

    if (shipDest !== routeDest.current) {
      routeDest.current = shipDest;
      pathT.current = 0;
      pathDone.current = !shipDest;
      finalApproachAngle.current = null;
      if (shipDest && obj) {
        orbiting.current = false;
        flightCurve.current = buildFlightPathCurve(
          pos.current,
          tmpTarget.current
        );
      } else {
        orbiting.current = true;
        flightCurve.current = null;
      }
    }

    curSpeed.current = 0;

    if (!paused && obj) {
      if (cruising && !orbiting.current) {
        const orbitR = parkRadius(shipDest!);

        // Phase 1: follow the smooth spline path.
        if (!pathDone.current && flightCurve.current) {
          const curve = flightCurve.current;
          const len = Math.max(curve.getLength(), 1);
          const advance =
            (SHIP_SPEED * step * Math.max(timeScale, 0.35)) / len;
          pathT.current = Math.min(pathT.current + advance, 1);

          curve.getPoint(pathT.current, pos.current);
          repelFromSun(pos.current);
          curve.getTangent(pathT.current, tmpTan.current);
          if (tmpTan.current.lengthSq() > 1e-6) {
            heading.current.copy(tmpTan.current).normalize();
          }
          curSpeed.current = SHIP_SPEED * Math.max(timeScale, 0.35);

          if (pathT.current >= PATH_END_T) {
            pathDone.current = true;
          }
        } else {
          // Phase 2: final approach to the moving parking ring.
          if (finalApproachAngle.current === null) {
            tmpDir.current.copy(pos.current).sub(tmpTarget.current);
            finalApproachAngle.current =
              tmpDir.current.lengthSq() > 0.04
                ? Math.atan2(tmpDir.current.z, tmpDir.current.x)
                : angle.current;
          }
          computeSeekAvoidingSun(
            pos.current,
            tmpTarget.current,
            orbitR,
            finalApproachAngle.current,
            tmpSeek.current
          );

          tmpDir.current.copy(tmpSeek.current).sub(pos.current);
          const distToSeek = tmpDir.current.length();
          const distToCenter = pos.current.distanceTo(tmpTarget.current);
          const onParkingRing = Math.abs(distToCenter - orbitR) <= 2;
          const closeEnough = distToCenter <= orbitR + 2.5;

          if (
            distToSeek <= ORBIT_ARRIVE ||
            onParkingRing ||
            closeEnough
          ) {
            angle.current = finalApproachAngle.current ?? angle.current;
            snapToOrbit(
              pos.current,
              tmpTarget.current,
              orbitR,
              angle,
              heading.current
            );
            arriveShip();
            orbiting.current = true;
            flightCurve.current = null;
            pathDone.current = true;
            routeDest.current = null;
            finalApproachAngle.current = null;
          } else {
            tmpDir.current.normalize();
            heading.current.lerp(tmpDir.current, 0.14).normalize();
            const slow = THREE.MathUtils.clamp(distToSeek / 14, 0.22, 1);
            const v =
              SHIP_SPEED * slow * 1.35 * step * Math.max(timeScale, 0.35);
            const moved = Math.min(v, Math.max(distToSeek - 0.05, 0.04));
            pos.current.addScaledVector(heading.current, moved);
            repelFromSun(pos.current);
            curSpeed.current = step > 0 ? moved / step : 0;
          }
        }
      } else if (orbiting.current) {
        stepOrbit(shipTarget, step, timeScale);
      }
    }

    g.position.copy(pos.current);
    quat.current.setFromUnitVectors(FORWARD, heading.current);
    g.quaternion.copy(quat.current);

    if (cruising && !orbiting.current && obj) {
      const pts: THREE.Vector3[] = [pos.current.clone()];
      if (!pathDone.current && flightCurve.current) {
        sampleFlightPath(
          flightCurve.current,
          pathT.current,
          1,
          56,
          routePts.current
        );
        pts.push(...routePts.current);
      } else {
        if (finalApproachAngle.current !== null) {
          applyOrbitPosition(
            tmpSeek.current,
            tmpTarget.current,
            parkRadius(shipDest!),
            finalApproachAngle.current
          );
          pts.push(tmpSeek.current.clone());
        } else {
          pts.push(tmpTarget.current.clone());
        }
      }
      routeGeom.setFromPoints(pts);
      routeLine.computeLineDistances();
      routeLine.visible = true;
    } else {
      routeLine.visible = false;
    }

    const thrusting = cruising && !orbiting.current;
    const flick = 0.88 + Math.sin(performance.now() * 0.03) * 0.12;
    for (const ref of [thrusterLRef, thrusterRRef]) {
      if (!ref.current) continue;
      const s = (thrusting ? 0.42 : 0.18) * flick;
      ref.current.scale.set(s, s, s);
      (ref.current.material as THREE.SpriteMaterial).opacity = thrusting ? 0.95 : 0;
    }
    for (const ref of [plumeLRef, plumeRRef]) {
      if (!ref.current) continue;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = thrusting ? 0.55 * flick : 0;
      ref.current.scale.set(1, 1, thrusting ? 0.85 + flick * 0.25 : 0.35);
    }

    teleAcc.current += dt;
    if (teleAcc.current >= 0.12) {
      teleAcc.current = 0;
      const distToFocus = obj
        ? pos.current.distanceTo(tmpTarget.current)
        : 0;
      useStore.getState().setTelemetry(curSpeed.current, distToFocus);
    }
  });

  const active = hoveredId === "ship" || selectedId === "ship";

  return (
    <group>
      <primitive object={routeLine} />
      <group ref={groupRef}>
        <group ref={anchorRef}>
          <ShipModel onLayout={onShipLayout} />

          {([-1, 1] as const).map((side) => {
            const plumeLen = 0.38;
            return (
              <group key={side}>
                <sprite
                  ref={side === -1 ? thrusterLRef : thrusterRRef}
                  position={[
                    side * shipLayout.engineSpread,
                    shipLayout.engineY,
                    shipLayout.engineZ,
                  ]}
                  scale={[0.28, 0.28, 0.28]}
                >
                  <spriteMaterial
                    map={thrusterTex}
                    color="#5ce1ff"
                    transparent
                    opacity={0}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                  />
                </sprite>
                <mesh
                  ref={side === -1 ? plumeLRef : plumeRRef}
                  position={[
                    side * shipLayout.engineSpread,
                    shipLayout.engineY,
                    shipLayout.engineZ - plumeLen * 0.5,
                  ]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <coneGeometry args={[0.055, plumeLen, 12, 1, true]} />
                  <meshBasicMaterial
                    color="#38bdf8"
                    transparent
                    opacity={0}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            );
          })}

          <mesh
            visible={false}
            onClick={(e) => {
              e.stopPropagation();
              useStore.getState().clickBody("ship");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              useStore.getState().hover("ship");
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              useStore.getState().hover(null);
              document.body.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[shipLayout.pickRadius, 12, 12]} />
          </mesh>

          {active && shipCam === "none" && (
            <Html center distanceFactor={8} position={[0, shipLayout.labelY, 0]}>
              <ShipLabel />
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}
