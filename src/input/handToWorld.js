import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";

export function mapHandToWorld(landmark, camera) {
    // landmark.x, y are in [0, 1]
    // map them into a visible world space

    const x = (landmark.x - 0.5) * 10;   // left ↔ right
    const y = (0.5 - landmark.y) * 10;   // up ↔ down
    const z = 0;                         // fixed depth (grid plane)

    return new THREE.Vector3(x, y, z);
}
