let active = false
let time = 0

export function triggerExplosion() {
  active = true
  time = 0
}

export function updateExplosion(coreSphere) {
  if (!active) return

  time += 0.05
  const scale = 1 + Math.sin(time * Math.PI) * 1.5
  coreSphere.scale.set(scale, scale, scale)

  if (time >= 1) active = false
}