import * as THREE from 'three'

export function createCyberGrid() {
  const grid = new THREE.GridHelper(
    100,      // size
    100,      // divisions
    0x00ffff, // center line color
    0x00ffff  // grid color
  )

  grid.position.y = -6
  grid.material.opacity = 0.15
  grid.material.transparent = true

  return grid
}