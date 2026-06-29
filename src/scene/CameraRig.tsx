import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";
import { getBodyRadius, getMoonParentId, SUN } from "../data/bodies";
import { SPACE_STATION } from "../data/station";
import { getSystemOverviewDistance } from "../data/systems";
import { findBlackHole } from "../data/blackholes";
import { getBodyObject } from "./registry";

const OVERVIEW_DISTANCE = 200;
const PLANET_VIEW_FACTOR = 5.5; // normal "selected" framing
const ORBIT_PLANET_FACTOR = 3.0; // close cinematic orbit of a planet
const ORBIT_MOON_FACTOR = 4.5; // close cinematic orbit of a moon
const UP = new THREE.Vector3(0, 1, 0);

export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as any;
  const selectedId = useStore((s) => s.selectedId);
  const orbitId = useStore((s) => s.orbitId);
  const activeSystem = useStore((s) => s.activeSystem);
  const warping = useStore((s) => s.warping);
  const warpTo = useStore((s) => s.warpTo);
  const shipCam = useStore((s) => s.shipCam);

  const transitioning = useRef(false);
  const desiredDist = useRef(OVERVIEW_DISTANCE);
  const frameParentId = useRef<string | null>(null);
  const frameSunlit = useRef(false);
  const desiredDir = useRef<THREE.Vector3 | null>(null);
  const prevTarget = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());
  const tmp2 = useRef(new THREE.Vector3());
  const tmpDir = useRef(new THREE.Vector3());
  const curTarget = useRef(new THREE.Vector3());
  // Ship-camera scratch vectors
  const shipPos = useRef(new THREE.Vector3());
  const shipQuat = useRef(new THREE.Quaternion());
  const fwd = useRef(new THREE.Vector3());
  const camGoal = useRef(new THREE.Vector3());
  const lookGoal = useRef(new THREE.Vector3());
  const WORLD_UP = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    if (shipCam !== "none") {
      // Manual control takes over in useFrame; nothing to precompute.
    } else if (orbitId) {
      const r = getBodyRadius(orbitId) || 1;
      const parentId = getMoonParentId(orbitId);
      if (parentId) {
        desiredDist.current = Math.max(r * ORBIT_MOON_FACTOR, 1.0);
        frameParentId.current = parentId; // frame so the planet is in view
        frameSunlit.current = false;
      } else {
        desiredDist.current = Math.max(r * ORBIT_PLANET_FACTOR, 2.4);
        frameParentId.current = null;
        frameSunlit.current = true; // show the beautiful sunlit hemisphere
      }
    } else if (selectedId === "ship") {
      desiredDist.current = 5.5;
      frameParentId.current = null;
      frameSunlit.current = false;
    } else if (selectedId === "station") {
      desiredDist.current = 4.2;
      frameParentId.current = SPACE_STATION.parentId;
      frameSunlit.current = false;
    } else if (findBlackHole(selectedId)) {
      desiredDist.current = findBlackHole(selectedId)!.visual.overview * 0.85;
      frameParentId.current = null;
      frameSunlit.current = false;
    } else if (selectedId) {
      const r = getBodyRadius(selectedId) || 1;
      desiredDist.current = Math.max(r * PLANET_VIEW_FACTOR, 7);
      frameParentId.current = null;
      frameSunlit.current = false;
    } else {
      const bh = findBlackHole(activeSystem);
      desiredDist.current = bh
        ? bh.visual.overview
        : getSystemOverviewDistance(activeSystem);
      frameParentId.current = null;
      frameSunlit.current = false;
    }
    desiredDir.current = null;
    transitioning.current = true;
  }, [selectedId, orbitId, activeSystem, shipCam]);

  useFrame((_, dt) => {
    if (!controls) return;

    // Ship cinematic cameras: fully manual, OrbitControls disabled.
    if (shipCam !== "none") {
      const ship = getBodyObject("ship");
      if (ship) {
        controls.enabled = false;
        ship.getWorldPosition(shipPos.current);
        ship.getWorldQuaternion(shipQuat.current);
        // Ship nose points local +Z
        fwd.current.set(0, 0, 1).applyQuaternion(shipQuat.current).normalize();

        if (shipCam === "chase") {
          // Cinematic tail cam: behind and slightly above, looking ahead.
          camGoal.current
            .copy(shipPos.current)
            .addScaledVector(fwd.current, -4.6)
            .addScaledVector(WORLD_UP.current, 1.7);
          lookGoal.current
            .copy(shipPos.current)
            .addScaledVector(fwd.current, 3.0);
          const k = 1 - Math.pow(0.0001, Math.min(dt, 0.05));
          camera.position.lerp(camGoal.current, k);
          controls.target.lerp(lookGoal.current, k);
        } else {
          // Cockpit first-person: just ahead of the nose, looking forward.
          camGoal.current
            .copy(shipPos.current)
            .addScaledVector(fwd.current, 0.62)
            .addScaledVector(WORLD_UP.current, 0.1);
          lookGoal.current
            .copy(shipPos.current)
            .addScaledVector(fwd.current, 80);
          camera.position.copy(camGoal.current);
          controls.target.copy(lookGoal.current);
        }
        camera.lookAt(controls.target);
        controls.update();
      }
      transitioning.current = true; // resume smoothly when exiting
      return;
    }
    if (!controls.enabled) controls.enabled = true;

    // Deep-space dive: before the scene swaps, rush the camera forward toward
    // its look target so it feels like plunging into hyperspace.
    const diving = warping && warpTo != null && warpTo !== activeSystem;
    if (diving) {
      const k = 1 - Math.pow(0.05, Math.min(dt, 0.05));
      const offset = tmp.current.copy(camera.position).sub(controls.target);
      const len = offset.length() || 1;
      // Rush inward but stop short of the center for a clean post-swap pull-back.
      const target = Math.max(len * (1 - k * 1.5), 10);
      camera.position
        .copy(controls.target)
        .addScaledVector(offset.normalize(), target);
      controls.update();
      transitioning.current = true; // recenter after the swap
      return;
    }

    const focusId = orbitId ?? selectedId ?? SUN.id;
    const obj = getBodyObject(focusId);
    if (obj) {
      obj.getWorldPosition(curTarget.current);
    } else {
      curTarget.current.set(0, 0, 0);
    }

    if (transitioning.current) {
      controls.target.lerp(curTarget.current, 0.08);

      // Cinematic framing for a moon orbit: look across the moon toward its
      // parent planet (e.g. Earthrise from the Moon).
      if (frameParentId.current) {
        const parent = getBodyObject(frameParentId.current);
        if (parent) {
          parent.getWorldPosition(tmp2.current);
          const toParent = tmp2.current.sub(curTarget.current); // parent - moon
          const tang = tmpDir.current.crossVectors(toParent, UP);
          if (tang.lengthSq() > 1e-6) {
            tang.normalize().addScaledVector(UP, 0.28).normalize();
            desiredDir.current = tang;
          }
        }
      } else if (frameSunlit.current) {
        // place the camera between the Sun (origin) and the body so the lit
        // hemisphere faces us, tilted slightly up for a flattering angle
        const dir = tmpDir.current.copy(curTarget.current).multiplyScalar(-1);
        if (dir.lengthSq() > 1e-6) {
          dir.normalize().addScaledVector(UP, 0.32).normalize();
          desiredDir.current = dir;
        }
      }

      const offset = tmp.current.copy(camera.position).sub(controls.target);
      const len = offset.length() || 1;
      offset.normalize();
      if (desiredDir.current) {
        offset.lerp(desiredDir.current, 0.12);
        if (offset.lengthSq() < 1e-6) offset.copy(desiredDir.current);
        offset.normalize();
      }
      const newLen = THREE.MathUtils.lerp(len, desiredDist.current, 0.06);
      camera.position.copy(controls.target).addScaledVector(offset, newLen);

      const targetClose = controls.target.distanceTo(curTarget.current) < 0.4;
      const distClose = Math.abs(newLen - desiredDist.current) < 0.6;
      const dirClose =
        !desiredDir.current || offset.angleTo(desiredDir.current) < 0.06;
      if (targetClose && distClose && dirClose) {
        transitioning.current = false;
        prevTarget.current.copy(curTarget.current);
      }
    } else {
      // Follow the moving body so it stays centered while the user orbits.
      const delta = tmp.current.copy(curTarget.current).sub(prevTarget.current);
      camera.position.add(delta);
      controls.target.add(delta);
      prevTarget.current.copy(curTarget.current);
    }

    controls.update();
  });

  return null;
}
