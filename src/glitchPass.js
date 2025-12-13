import * as THREE from 'three'
import { Pass } from 'three/addons/postprocessing/Pass.js'

export class GlitchPass extends Pass {
  constructor() {
    super()

    this.uniforms = {
      tDiffuse: { value: null },
      time: { value: 0 }
    }

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        varying vec2 vUv;

        float rand(vec2 c) {
          return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv;
          float glitch = step(0.97, rand(vec2(time, uv.y)));
          uv.x += glitch * 0.04 * rand(uv);
          gl_FragColor = texture2D(tDiffuse, uv);
        }
      `
    })

    this.fsQuad = new Pass.FullScreenQuad(this.material)
    this.needsSwap = true
  }

  render(renderer, writeBuffer, readBuffer, deltaTime) {
    this.uniforms.tDiffuse.value = readBuffer.texture
    this.uniforms.time.value += deltaTime

    if (this.renderToScreen) {
      renderer.setRenderTarget(null)
      this.fsQuad.render(renderer)
    } else {
      renderer.setRenderTarget(writeBuffer)
      renderer.clear()
      this.fsQuad.render(renderer)
    }
  }
}