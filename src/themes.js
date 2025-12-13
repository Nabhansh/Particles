import * as THREE from 'three'

export const THEMES = {
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk',

hdr: 'https://raw.githubusercontent.com/gkjohnson/3d-demo-data/master/hdri/venice_sunset_1k.hdr',
    fallbackBg: new THREE.Color('#05000a'),

    colors: [
      new THREE.Color('#00ffff'), // cyan
      new THREE.Color('#ff00ff'), // magenta
      new THREE.Color('#8a2be2'), // purple
      new THREE.Color('#00ff9c')  // neon green
    ],

    accent: new THREE.Color('#00ffff'),

    bloom: {
      strength: 1.8,
      radius: 0.6,
      threshold: 0.1
    }
  }
}