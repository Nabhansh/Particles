export function startMatrixRain() {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = 0
  canvas.style.left = 0
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = 5
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')

  let fontSize = 14
  let columns
  let drops

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    columns = Math.floor(canvas.width / fontSize)
    drops = Array(columns).fill(1)
  }

  resize()
  window.addEventListener('resize', resize)

  const letters = '01'

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#00ff9c'
    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)]
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }

    requestAnimationFrame(draw)
  }

  draw()
}