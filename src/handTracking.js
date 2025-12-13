import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { camera, applyTheme } from "./scene.js"
import { THEMES } from "./themes.js"
import { triggerExplosion } from "./explosion.js"

let handLandmarker
let pinching = false
let fistClosed = false

let lastDetectTime = 0
const DETECT_INTERVAL = 80 // ms ≈ 12 FPS

const themeList = Object.values(THEMES)
let themeIndex = 0

export async function initHandTracking() {
  try {
    console.log("1️⃣ initHandTracking started")

    // ✅ STABLE CDN (IMPORTANT)
    const vision = await FilesetResolver.forVisionTasks(
      "https://unpkg.com/@mediapipe/tasks-vision@0.10.3/wasm"
    )
    console.log("2️⃣ Vision WASM loaded")

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
      },
      runningMode: "VIDEO",
      numHands: 1
    })
    console.log("3️⃣ HandLandmarker created")

    const video = document.getElementById("webcam")
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = stream
    console.log("4️⃣ Webcam stream attached")

    video.onloadeddata = () => detect(video)

    document.getElementById("loading").style.display = "none"
    console.log("5️⃣ Loading screen hidden")

  } catch (err) {
    console.error("❌ Hand tracking failed:", err)
  }
}

function detect(video) {
  const now = performance.now()

  // 🔥 THROTTLE MEDIAPIPE
  if (now - lastDetectTime < DETECT_INTERVAL) {
    requestAnimationFrame(() => detect(video))
    return
  }
  lastDetectTime = now

  const res = handLandmarker.detectForVideo(video, now)

  if (res.landmarks && res.landmarks.length > 0) {
    const lm = res.landmarks[0]

    /* ================= CAMERA CONTROL ================= */
    const palm = lm[9]
    const theta = palm.x * Math.PI * 2

    camera.position.x = Math.cos(theta) * 14
    camera.position.z = Math.sin(theta) * 14
    camera.position.y = (0.5 - palm.y) * 8
    camera.lookAt(0, 0, 0)

    /* ================= PINCH → THEME ================= */
    const thumb = lm[4]
    const indexFinger = lm[8]

    const pinchDist = Math.hypot(
      thumb.x - indexFinger.x,
      thumb.y - indexFinger.y
    )

    if (pinchDist < 0.05 && !pinching) {
      themeIndex = (themeIndex + 1) % themeList.length
      applyTheme(themeList[themeIndex])
      pinching = true
    }

    if (pinchDist > 0.08) {
      pinching = false
    }

    /* ================= FIST → EXPLOSION ================= */
    const wrist = lm[0]
    const tips = [8, 12, 16, 20]

    let avgDist = 0
    tips.forEach(i => {
      avgDist += Math.hypot(
        lm[i].x - wrist.x,
        lm[i].y - wrist.y
      )
    })
    avgDist /= tips.length

    if (avgDist < 0.22 && !fistClosed) {
      triggerExplosion()
      fistClosed = true
    }

    if (avgDist > 0.3) {
      fistClosed = false
    }
  }

  requestAnimationFrame(() => detect(video))
}