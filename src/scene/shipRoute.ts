import * as THREE from "three";

const ORIGIN = new THREE.Vector3(0, 0, 0);
/** Sun mesh radius ≈ 9. Ship must stay outside this. */
export const SUN_BODY = 12;
/** Extra margin for path centerline + glow. */
export const SUN_CLEAR = 26;

const _ab = new THREE.Vector3();
const _ap = new THREE.Vector3();
const _closest = new THREE.Vector3();
const _fromH = new THREE.Vector3();
const _toH = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _sample = new THREE.Vector3();

export type FlightPath = THREE.CurvePath<THREE.Vector3>;

export function segmentIntersectsSphere(
  a: THREE.Vector3,
  b: THREE.Vector3,
  center: THREE.Vector3,
  radius: number
): boolean {
  _ab.subVectors(b, a);
  const lenSq = _ab.lengthSq();
  if (lenSq < 1e-8) return a.distanceTo(center) < radius;
  const t = THREE.MathUtils.clamp(_ap.subVectors(center, a).dot(_ab) / lenSq, 0, 1);
  _closest.copy(a).addScaledVector(_ab, t);
  return _closest.distanceTo(center) < radius;
}

function horizDist(v: THREE.Vector3): number {
  return Math.sqrt(v.x * v.x + v.z * v.z);
}

function shortestAngleDelta(from: number, to: number): number {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

function ringPoint(angle: number, radius: number, y: number): THREE.Vector3 {
  return new THREE.Vector3(Math.cos(angle) * radius, y, -Math.sin(angle) * radius);
}

/** Dense check – catches chords that graze the Sun. */
function segmentNearSun(a: THREE.Vector3, b: THREE.Vector3, minR: number): boolean {
  if (segmentIntersectsSphere(a, b, ORIGIN, minR)) return true;
  for (let i = 0; i <= 32; i++) {
    _sample.lerpVectors(a, b, i / 32);
    if (_sample.distanceTo(ORIGIN) < minR) return true;
  }
  return false;
}

function bezierNearSun(
  start: THREE.Vector3,
  ctrl: THREE.Vector3,
  end: THREE.Vector3,
  minR: number
): boolean {
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    const u = 1 - t;
    _sample.set(0, 0, 0);
    _sample.addScaledVector(start, u * u);
    _sample.addScaledVector(ctrl, 2 * u * t);
    _sample.addScaledVector(end, t * t);
    if (_sample.distanceTo(ORIGIN) < minR) return true;
  }
  return false;
}

/** True when a hop must arc around the Sun. */
export function needsSunDetour(from: THREE.Vector3, to: THREE.Vector3): boolean {
  if (segmentNearSun(from, to, SUN_CLEAR)) return true;

  _fromH.set(from.x, 0, from.z);
  _toH.set(to.x, 0, to.z);
  const rFrom = horizDist(from);
  const rTo = horizDist(to);
  if (rFrom > 0.5 && rTo > 0.5) {
    const aFrom = Math.atan2(_fromH.z, _fromH.x);
    const aTo = Math.atan2(_toH.z, _toH.x);
    const angleDiff = Math.abs(shortestAngleDelta(aFrom, aTo));
    // Different sides of the Sun, or large sweep across the inner system.
    if (angleDiff > Math.PI / 3) return true;
    if (rTo < rFrom - 1 && angleDiff > 0.25) return true;
  }

  _mid.copy(from).add(to).multiplyScalar(0.5);
  if (_mid.distanceTo(ORIGIN) < SUN_CLEAR) return true;
  return false;
}

function pushArc(
  path: FlightPath,
  aStart: number,
  aEnd: number,
  radius: number,
  y: number,
  from: THREE.Vector3
): THREE.Vector3 {
  const delta = shortestAngleDelta(aStart, aEnd);
  const steps = Math.max(12, Math.ceil(Math.abs(delta) / (Math.PI / 32)));
  let prev = from.clone();
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const pt = ringPoint(aStart + delta * t, radius, y);
    path.add(new THREE.LineCurve3(prev, pt));
    prev = pt;
  }
  return prev;
}

function pushSafeBezier(
  path: FlightPath,
  start: THREE.Vector3,
  end: THREE.Vector3,
  yHint: number
) {
  let ctrl = start.clone().lerp(end, 0.5);
  ctrl.y = yHint;

  if (horizDist(ctrl) < SUN_CLEAR) {
    const a = Math.atan2(start.z + end.z, start.x + end.x);
    ctrl = ringPoint(a, SUN_CLEAR + 6, yHint + 2);
  }
  if (segmentNearSun(start, end, SUN_CLEAR - 2)) {
    const a = Math.atan2(end.z - start.z, end.x - start.x) + Math.PI / 2;
    ctrl = ringPoint(
      a,
      Math.max(horizDist(start), horizDist(end), SUN_CLEAR + 8),
      yHint + 2.5
    );
  }
  if (bezierNearSun(start, ctrl, end, SUN_BODY)) {
    const aFrom = Math.atan2(start.z, start.x);
    const aTo = Math.atan2(end.z, end.x);
    const midA = aFrom + shortestAngleDelta(aFrom, aTo) * 0.5;
    ctrl = ringPoint(
      midA,
      Math.max(horizDist(start), horizDist(end), SUN_CLEAR + 8),
      yHint + 3
    );
  }
  path.add(new THREE.QuadraticBezierCurve3(start.clone(), ctrl, end.clone()));
}

function validatePath(path: FlightPath, minR: number): boolean {
  for (let i = 0; i <= 160; i++) {
    path.getPoint(i / 160, _closest);
    if (_closest.distanceTo(ORIGIN) < minR) return false;
  }
  return true;
}

function buildDirectPath(from: THREE.Vector3, to: THREE.Vector3): FlightPath {
  const path = new THREE.CurvePath<THREE.Vector3>();
  _mid.copy(from).add(to).multiplyScalar(0.5);
  _mid.y += Math.max(from.distanceTo(to) * 0.06, 1.5);
  if (_mid.distanceTo(ORIGIN) < SUN_CLEAR + 2) {
    const a = Math.atan2(_mid.z, _mid.x);
    _mid.copy(ringPoint(a, SUN_CLEAR + 6, Math.max(from.y, to.y) + 2.5));
  }
  pushSafeBezier(path, from, to, Math.max(from.y, to.y) + 1.5);
  return path;
}

/**
 * Build a flight path that never cuts through the Sun.
 */
export function buildFlightPathCurve(
  from: THREE.Vector3,
  to: THREE.Vector3
): FlightPath {
  let transferR = Math.max(horizDist(from), horizDist(to), SUN_CLEAR) + 14;

  for (let attempt = 0; attempt < 6; attempt++) {
    const forceDetour = attempt > 0 || needsSunDetour(from, to);
    const path = forceDetour
      ? buildDetourPath(from, to, transferR)
      : buildDirectPath(from, to);

    if (validatePath(path, SUN_BODY)) return path;
    transferR += 10;
  }

  return buildDetourPath(from, to, transferR);
}

function buildDetourPath(
  from: THREE.Vector3,
  to: THREE.Vector3,
  transferR: number
): FlightPath {
  const path = new THREE.CurvePath<THREE.Vector3>();

  _fromH.set(from.x, 0, from.z);
  _toH.set(to.x, 0, to.z);
  const rFrom = Math.max(horizDist(from), 0.5);
  const rTo = Math.max(horizDist(to), 0.5);
  const aFrom = Math.atan2(_fromH.z, _fromH.x);
  const aTo = Math.atan2(_toH.z, _toH.x);
  const delta = shortestAngleDelta(aFrom, aTo);
  const yLift = Math.max(from.y, to.y, 1.5) * 0.32 + 3;

  transferR = Math.max(transferR, rFrom + 6, rTo + 6, SUN_CLEAR + 10);

  const arcEntry = ringPoint(aFrom, transferR, yLift);

  if (rFrom < transferR - 1.5) {
    const climbCtrl = ringPoint(
      aFrom,
      Math.max(transferR + 6, rFrom + 10),
      THREE.MathUtils.lerp(from.y, yLift, 0.6)
    );
    path.add(new THREE.QuadraticBezierCurve3(from.clone(), climbCtrl, arcEntry.clone()));
  } else if (from.distanceTo(arcEntry) > 0.5) {
    path.add(new THREE.LineCurve3(from.clone(), arcEntry.clone()));
  }

  let tail = arcEntry.clone();
  if (path.curves.length > 0) {
    const last = path.curves[path.curves.length - 1];
    if (last instanceof THREE.QuadraticBezierCurve3) tail.copy(last.v2);
    else if (last instanceof THREE.LineCurve3) tail.copy(last.v2);
  }
  tail = pushArc(path, aFrom, aTo, transferR, yLift, tail);

  const overshoot =
    Math.sign(delta || 1) * Math.min(Math.abs(delta) * 0.15 + 0.22, 0.65);
  const aDescend = aTo + overshoot;
  const descendStart = ringPoint(aDescend, transferR, yLift * 0.92);
  if (tail.distanceTo(descendStart) > 0.5) {
    tail = pushArc(path, aTo, aDescend, transferR, yLift * 0.92, tail);
  }

  const sideSign = Math.sign(overshoot || delta || 1);
  const approachAngle = aTo + sideSign * 0.75;
  const approachR = Math.max(rTo + 8, SUN_CLEAR + 4);
  const approachPt = ringPoint(
    approachAngle,
    approachR,
    THREE.MathUtils.lerp(yLift, to.y, 0.55)
  );

  pushSafeBezier(path, tail, approachPt, yLift * 0.75);
  pushSafeBezier(path, approachPt, to.clone(), Math.max(to.y, 1.2) + 1.5);

  return path;
}

/** Push the ship outside the Sun if the path cuts too close. */
export function repelFromSun(pos: THREE.Vector3) {
  const dist = pos.distanceTo(ORIGIN);
  if (dist >= SUN_BODY) return;
  const a = Math.atan2(pos.z, pos.x);
  pos.copy(ringPoint(a, SUN_CLEAR, Math.max(pos.y, 2.5)));
}

/** Seek target for final approach – detours around the Sun when needed. */
export function computeSeekAvoidingSun(
  ship: THREE.Vector3,
  target: THREE.Vector3,
  orbitR: number,
  approachAngle: number,
  out: THREE.Vector3
) {
  applyOrbitPosition(out, target, orbitR, approachAngle);

  if (!segmentNearSun(ship, out, SUN_BODY)) return;

  const transferR = Math.max(horizDist(ship), horizDist(target), SUN_CLEAR) + 8;
  const aShip = Math.atan2(ship.z, ship.x);
  const aTgt = Math.atan2(target.z, target.x);
  const delta = shortestAngleDelta(aShip, aTgt);
  const y = Math.max(ship.y, target.y, 2) + 2;

  out.copy(ringPoint(aShip + Math.sign(delta || 1) * 0.55, transferR, y));

  if (segmentNearSun(ship, out, SUN_BODY)) {
    const midA = aShip + delta * 0.45;
    out.copy(ringPoint(midA, transferR + 4, y + 1));
  }
}

export function orbitPointOnRing(
  target: THREE.Vector3,
  ship: THREE.Vector3,
  orbitR: number,
  out: THREE.Vector3
) {
  out.copy(ship).sub(target);
  if (out.lengthSq() < 0.04) out.set(orbitR, 0, 0);
  else out.setLength(orbitR);
  out.add(target);
}

export function snapToOrbit(
  pos: THREE.Vector3,
  target: THREE.Vector3,
  orbitR: number,
  angle: { current: number },
  heading: THREE.Vector3
) {
  const offset = _ab.subVectors(pos, target);
  if (offset.lengthSq() < 0.04) {
    offset.set(orbitR, 0, 0);
  } else {
    offset.setLength(orbitR);
  }
  pos.copy(target).add(offset);
  angle.current = Math.atan2(offset.z, offset.x);
  heading.set(-Math.sin(angle.current), 0, -Math.cos(angle.current)).normalize();
}

export function applyOrbitPosition(
  pos: THREE.Vector3,
  target: THREE.Vector3,
  orbitR: number,
  angle: number
) {
  pos.set(
    target.x + Math.cos(angle) * orbitR,
    target.y + orbitR * 0.18,
    target.z - Math.sin(angle) * orbitR
  );
}

export function sampleFlightPath(
  curve: THREE.Curve<THREE.Vector3>,
  fromT: number,
  toT: number,
  segments: number,
  out: THREE.Vector3[]
) {
  out.length = 0;
  for (let i = 0; i <= segments; i++) {
    const t = THREE.MathUtils.lerp(fromT, toT, i / segments);
    out.push(curve.getPoint(t, new THREE.Vector3()));
  }
}
