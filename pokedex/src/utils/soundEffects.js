// 8-bit Retro GameBoy Sound Synthesizer using pure Web Audio API
// Zero external files, zero latency, 100% offline

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

let muted = typeof window !== 'undefined' 
  ? localStorage.getItem('pokedex_retro_muted') === 'true' 
  : false

export const soundFx = {
  isMuted() {
    return muted
  },

  setMuted(val) {
    muted = Boolean(val)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_retro_muted', String(muted))
    }
    return muted
  },

  toggleMute() {
    return this.setMuted(!muted)
  },

  // 8-bit button press blip
  playClick() {
    if (muted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    osc.type = 'square'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.05)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  },

  // Retro menu select / confirm
  playSelect() {
    if (muted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.setValueAtTime(880, now + 0.06) // A5

    gain.gain.setValueAtTime(0.09, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.14)
  },

  // Retro cancel / back
  playBack() {
    if (muted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.setValueAtTime(260, now + 0.06)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.14)
  },

  // Star / favorite chime (happy arpeggio)
  playFavorite() {
    if (muted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.05
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.1, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.12)
    })
  },

  // Dice roll / randomizer
  playDice() {
    if (muted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    for (let i = 0; i < 5; i++) {
      const start = now + i * 0.04
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(300 + Math.random() * 500, start)

      gain.gain.setValueAtTime(0.06, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.035)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.035)
    }
  },

  // Pokémon 8-bit Cry synthesis parameterized by ID
  playCry(pokemonId = 1) {
    if (muted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Generate unique frequency & modulation curve from pokemon id
    const baseFreq = 160 + ((pokemonId * 37) % 520)
    const pitchMod = ((pokemonId * 19) % 300) + 100

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = pokemonId % 2 === 0 ? 'square' : 'sawtooth'

    osc.frequency.setValueAtTime(baseFreq, now)
    osc.frequency.linearRampToValueAtTime(baseFreq + pitchMod, now + 0.08)
    osc.frequency.exponentialRampToValueAtTime(Math.max(80, baseFreq - 60), now + 0.28)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.setValueAtTime(0.14, now + 0.07)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.3)
  },

  // Victory Fanfare for battle comparison
  playVictory() {
    if (muted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.5, d: 0.3 }   // C6
    ]

    let curr = ctx.currentTime
    notes.forEach(({ f, d }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(f, curr)

      gain.gain.setValueAtTime(0.1, curr)
      gain.gain.exponentialRampToValueAtTime(0.001, curr + d)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(curr)
      osc.stop(curr + d)
      curr += d * 0.8
    })
  },

  // Theme switch warble
  playTheme() {
    if (muted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.linearRampToValueAtTime(740, now + 0.15)

    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.18)
  }
}
