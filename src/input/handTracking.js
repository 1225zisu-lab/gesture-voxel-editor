export function initHandTracking(videoEl, onResults) {
    const hands = new window.Hands({
        locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.3,
        minTrackingConfidence: 0.3
    });


    hands.onResults(onResults);

    const camera = new window.Camera(videoEl, {
        onFrame: async () => {
            await hands.send({ image: videoEl });
        },
        width: 1280,
        height: 720
    });

    camera.start();
}
