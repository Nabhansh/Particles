import * as THREE from 'three'
import { audioLevel } from './audioReactive.js'
import { createCyberGrid } from './cyberGrid.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { updateExplosion } from './explosion.js'
import { createCoreSphere } from './particles.js'

export let scene, camera, renderer, composer, coreSphere
export let bloomPass

export function initScene() {
  /* ---------- SCENE ---------- */
  scene = new THREE.Scene()

  /* ---------- CAMERA ---------- */
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 14

  /* ---------- RENDERER ---------- */
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setSize(window.innerWidth, window.innerHeight)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0))
  document.body.appendChild(renderer.domElement)

  /* ---------- POST PROCESSING ---------- */
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.2,
    0.4,
    0.8
  )
  composer.addPass(bloomPass)

  /* ---------- OBJECTS ---------- */
  coreSphere = createCoreSphere()
  scene.add(coreSphere)

  const cyberGrid = createCyberGrid()
  scene.add(cyberGrid)

  window.addEventListener('resize', onResize)
}

export function applyTheme(theme) {
  if (!scene || !coreSphere) return

  new RGBELoader().load(
    theme.hdr,
    texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = texture
      scene.background = texture
    },
    undefined,
    () => {
      if (theme.fallbackBg) {
        scene.background = theme.fallbackBg
      }
    }
  )

  bloomPass.strength = theme.bloom.strength
  bloomPass.radius = theme.bloom.radius
  bloomPass.threshold = theme.bloom.threshold

  const colors = coreSphere.geometry.attributes.color
  for (let i = 0; i < colors.count; i++) {
    const c = theme.colors[i % theme.colors.length]
    colors.setXYZ(i, c.r, c.g, c.b)
  }
  colors.needsUpdate = true
}

export function animate() {
  if (!coreSphere) return

  /* ---------- AUDIO PULSE ---------- */
  const pulse = 1 + audioLevel * 0.4
  coreSphere.scale.set(pulse, pulse, pulse)

  bloomPass.strength = 1.2 + audioLevel * 2.0

  /* ---------- EXPLOSION ---------- */
  updateExplosion(coreSphere)

  /* ---------- ROTATION ---------- */
  coreSphere.rotation.y += 0.001

  composer.render()
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}