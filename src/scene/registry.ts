import * as THREE from "three";

// Maps body id -> the Object3D anchor positioned at the body's center.
// Used by the camera rig to fly to and follow a moving body.
const registry = new Map<string, THREE.Object3D>();

export function registerBody(id: string, obj: THREE.Object3D) {
  registry.set(id, obj);
}

export function unregisterBody(id: string) {
  registry.delete(id);
}

export function getBodyObject(id: string): THREE.Object3D | undefined {
  return registry.get(id);
}
