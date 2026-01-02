# Gesture Voxel Editor

A browser-based voxel editor controlled using real-time hand gestures.

This project uses **MediaPipe Hands** for gesture detection and **Three.js** for 3D rendering, allowing users to place and delete voxel blocks using pinch gestures directly in the browser.

## ✨ Features
- Real-time hand tracking using a standard laptop webcam
- Gesture-based cursor control
- Pinch gesture to place voxel blocks
- Spatial trash area to delete unwanted blocks
- Grid-snapped voxel placement
- Visual HUD for tracking and gesture feedback
- Robust recovery from tracking loss

## 🛠️ Tech Stack
- JavaScript (ES Modules)
- Three.js (WebGL)
- MediaPipe Hands
- HTML & CSS

## 🚀 How to Run Locally
```bash
git clone https://github.com/1225zisu-lab/gesture-voxel-editor.git
cd gesture-voxel-editor
python -m http.server 8000
