console.log("🔥 MAIN.JS LOADED AT", new Date().toISOString());

// ================== IMPORTS ==================
import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";

import { initHandTracking } from "./input/handTracking.js";
import { mapHandToWorld } from "./input/handToWorld.js";

import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { addLights } from "./core/lights.js";

// ================== DOM ==================
const video = document.getElementById("input_video");
const canvas = document.getElementById("three-canvas");

// ================== THREE.JS SETUP ==================
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer(canvas);
addLights(scene);

// Grid
const grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
scene.add(grid);

// ================== TRASH CAN ==================
const trash = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 0.5),
    new THREE.MeshStandardMaterial({
        color: 0xaa0000,
        emissive: 0x330000
    })
);

// bottom-right of the scene
trash.position.set(12, -8, 0);
scene.add(trash);


// ================== CURSOR ==================
const cursor = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.2, 1.2), // BIGGER cube
    new THREE.MeshStandardMaterial({
        color: 0xff0000,     // bright red
        emissive: 0x330000   // glow so it stands out
    })
);
scene.add(cursor);

// Velocity smoothing
//const cursorVelocity = new THREE.Vector3();

// ================== VOXEL SYSTEM ==================
const voxels = new Map(); // key: "x,y,z"

function snapToGrid(pos) {
    return new THREE.Vector3(
        Math.round(pos.x),
        Math.round(pos.y),
        Math.round(pos.z)
    );
}

function placeVoxel(worldPos) {
    const p = snapToGrid(worldPos);
    const key = `${p.x},${p.y},${p.z}`;

    if (voxels.has(key)) return;

    const voxel = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x00b3b3 })
    );

    voxel.position.copy(p);
    scene.add(voxel);
    voxels.set(key, voxel);
}
function isOverTrash(pos) {
    return pos.distanceTo(trash.position) < 2;
}


// ================== PINCH HELPERS ==================
function distance3D(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

let isPinching = false;
let wasPinching = false;

// ================== HAND TRACKING ==================
initHandTracking(video, (results) => {
    if (!results.multiHandLandmarks?.length) {
        cursor.material.color.set(0x555555);
        isPinching = false;
        wasPinching = false;
        return;
    }

    const lm = results.multiHandLandmarks[0];
    const indexTip = lm[8];
    const thumbTip = lm[4];

    // ---- virtual pointer ----
    const px = (indexTip.x + thumbTip.x) * 0.5;
    const py = (indexTip.y + thumbTip.y) * 0.5;

    const x = (0.5 - px) * 30;
    const y = (0.5 - py) * 30;

    cursor.position.set(x, y, 0);

    // ---- pinch detection ----
    const dx = indexTip.x - thumbTip.x;
    const dy = indexTip.y - thumbTip.y;
    const dz = indexTip.z - thumbTip.z;
    const pinchDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    isPinching = pinchDistance < 0.04;

    // ---- PLACE voxel on pinch START ----
    if (isPinching && !wasPinching) {
        if (isOverTrash(cursor.position)) {
            // ---- DELETE nearest voxel ----
            let closestKey = null;
            let minDist = Infinity;

            for (const [key, voxel] of voxels) {
                const d = voxel.position.distanceTo(cursor.position);
                if (d < minDist && d < 2) {
                    minDist = d;
                    closestKey = key;
                }
            }

            if (closestKey) {
                scene.remove(voxels.get(closestKey));
                voxels.delete(closestKey);
            }
        } else {
            // ---- PLACE voxel ----
            placeVoxel(cursor.position);
        }
    }


    cursor.material.color.set(isPinching ? 0x00ffcc : 0xff0000);
    wasPinching = isPinching;
});

// ================== RESIZE ==================
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ================== RENDER LOOP ==================
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
