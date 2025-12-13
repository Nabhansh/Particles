import { initScene, animate, applyTheme } from './scene.js'
import { THEMES } from './themes.js'
import { initHandTracking } from './handTracking.js'
import { startMatrixRain } from './matrixRain.js'

function initApp() {
  initScene()
  applyTheme(THEMES.cyber)
  startMatrixRain()
  initHandTracking()
  loop()
}

function loop() {
  animate()
  requestAnimationFrame(loop)
}

window.addEventListener('DOMContentLoaded', initApp)