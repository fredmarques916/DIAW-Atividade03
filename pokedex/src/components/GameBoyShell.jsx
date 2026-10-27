import { soundFx } from '../utils/soundEffects'
import './GameBoyShell.css'

export default function GameBoyShell({
  children,
  onDpadUp,
  onDpadDown,
  onDpadLeft,
  onDpadRight,
  onBtnA,
  onBtnB,
  onSelect,
  onStart
}) {
  const handleDpad = (dir, callback) => {
    soundFx.playClick()
    if (callback) callback()
    else {
      // Default: scroll container
      const container = document.querySelector('.console-screen-viewport')
      if (container) {
        if (dir === 'up') container.scrollBy({ top: -150, behavior: 'smooth' })
        if (dir === 'down') container.scrollBy({ top: 150, behavior: 'smooth' })
      }
    }
  }

  const handleActionA = () => {
    soundFx.playSelect()
    if (onBtnA) onBtnA()
  }

  const handleActionB = () => {
    soundFx.playBack()
    if (onBtnB) onBtnB()
  }

  const handleSelectBtn = () => {
    soundFx.playTheme()
    if (onSelect) onSelect()
  }

  const handleStartBtn = () => {
    soundFx.playDice()
    if (onStart) onStart()
  }

  return (
    <div className="gameboy-outer-chassis">
      {/* Top Cartridge Ridge */}
      <div className="chassis-cartridge-groove"></div>

      {/* Screen Frame Bezel */}
      <div className="chassis-bezel">
        <div className="bezel-top-line">
          <div className="bezel-stripe stripe-magenta"></div>
          <div className="bezel-stripe stripe-blue"></div>
          <span className="bezel-title">DOT MATRIX WITH STEREO SOUND</span>
          <div className="bezel-stripe stripe-blue"></div>
          <div className="bezel-stripe stripe-magenta"></div>
        </div>

        <div className="bezel-battery-indicator">
          <div className="battery-led"></div>
          <span className="battery-text">BATTERY</span>
        </div>

        {/* Viewport Screen with Scanlines */}
        <div className="console-screen-viewport scanlines">
          {children}
        </div>
      </div>

      {/* Brand Label */}
      <div className="chassis-brand-row">
        <span className="brand-nintendo">Nintendo</span>
        <span className="brand-gameboy">
          GAME BOY <small className="brand-color">COLOR</small>
        </span>
      </div>

      {/* Controls Area (D-Pad, A/B, Start/Select, Speaker) */}
      <div className="chassis-controls-area">
        {/* D-Pad Cross */}
        <div className="dpad-wrapper">
          <div className="dpad-cross">
            <button
              type="button"
              className="dpad-btn dpad-up"
              onClick={() => handleDpad('up', onDpadUp)}
              aria-label="D-Pad Cima"
            >
              ▲
            </button>
            <button
              type="button"
              className="dpad-btn dpad-left"
              onClick={() => handleDpad('left', onDpadLeft)}
              aria-label="D-Pad Esquerda"
            >
              ◀
            </button>
            <div className="dpad-center"></div>
            <button
              type="button"
              className="dpad-btn dpad-right"
              onClick={() => handleDpad('right', onDpadRight)}
              aria-label="D-Pad Direita"
            >
              ▶
            </button>
            <button
              type="button"
              className="dpad-btn dpad-down"
              onClick={() => handleDpad('down', onDpadDown)}
              aria-label="D-Pad Baixo"
            >
              ▼
            </button>
          </div>
        </div>

        {/* Action Buttons A & B */}
        <div className="action-buttons-wrapper">
          <div className="ab-cluster">
            <div className="action-btn-group">
              <button
                type="button"
                className="gameboy-round-btn btn-b"
                onClick={handleActionB}
                aria-label="Botão B"
              >
                B
              </button>
              <span className="btn-label">B</span>
            </div>

            <div className="action-btn-group">
              <button
                type="button"
                className="gameboy-round-btn btn-a"
                onClick={handleActionA}
                aria-label="Botão A"
              >
                A
              </button>
              <span className="btn-label">A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Start / Select & Speaker Vents */}
      <div className="chassis-bottom-row">
        {/* Select & Start Pills */}
        <div className="start-select-cluster">
          <div className="pill-group">
            <button
              type="button"
              className="pill-btn"
              onClick={handleSelectBtn}
              aria-label="Select"
            />
            <span className="pill-label">SELECT (TEMA)</span>
          </div>

          <div className="pill-group">
            <button
              type="button"
              className="pill-btn"
              onClick={handleStartBtn}
              aria-label="Start"
            />
            <span className="pill-label">START (DADO)</span>
          </div>
        </div>

        {/* Slanted Speaker Slits */}
        <div className="speaker-grille">
          <div className="speaker-slit"></div>
          <div className="speaker-slit"></div>
          <div className="speaker-slit"></div>
          <div className="speaker-slit"></div>
          <div className="speaker-slit"></div>
          <div className="speaker-slit"></div>
        </div>
      </div>

      {/* Phones Jack notch */}
      <div className="chassis-phones-notch">
        <span>🎧 PHONES</span>
      </div>
    </div>
  )
}
