export let audioLevel = 0
let audioStarted = false

export async function initAudio() {
  if (audioStarted) return
  audioStarted = true

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()

    // Resume context on user gesture (required by browsers)
    if (ctx.state === 'suspended') {
      const resume = () => {
        ctx.resume()
        window.removeEventListener('click', resume)
        window.removeEventListener('keydown', resume)
      }
      window.addEventListener('click', resume)
      window.addEventListener('keydown', resume)
    }

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256

    const source = ctx.createMediaStreamSource(stream)
    source.connect(analyser)

    const data = new Uint8Array(analyser.frequencyBinCount)

    function update() {
      analyser.getByteFrequencyData(data)

      // normalize audio energy
      audioLevel =
        data.reduce((sum, v) => sum + v, 0) /
        (data.length * 255)

      requestAnimationFrame(update)
    }

    update()
  } catch (err) {
    console.warn('Microphone access denied or unavailable:', err)
    audioLevel = 0
  }
}
