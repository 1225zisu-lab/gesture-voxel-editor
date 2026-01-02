import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";

export function addLights(scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 5);
    scene.add(dir);
}
