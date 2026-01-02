import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 3, 8);
    return camera;
}
