import { Volume2, VolumeX, Dices, Palette, Monitor, Smartphone, List, Award, Swords } from 'lucide-react'
import { soundFx } from '../utils/soundEffects'
import './Header.css'

export default function Header({
  activeTab,
  setActiveTab,
  currentTheme,
  setCurrentTheme,
  isMuted,
  onToggleMute,
  onPickRandom,
  isConsoleFrame,
  setIsConsoleFrame
}) {
  const themes = [
    { id: 'kanto', label: 'Kanto Red' },
    { id: 'dmg', label: 'GameBoy DMG' },
    { id: 'color', label: 'Atomic Purple' },
    { id: 'dark', label: 'Dark Matrix' }
  ]

  const cycleTheme = () => {
    soundFx.playTheme()
    const currentIndex = themes.findIndex((t) => t.id === currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    setCurrentTheme(themes[nextIndex].id)
  }

  const handleTabChange = (tab) => {
    soundFx.playSelect()
    setActiveTab(tab)
  }

  const handleRandom = () => {
    soundFx.playDice()
    onPickRandom()
  }

  const handleMuteToggle = () => {
    onToggleMute()
  }

  const handleFrameToggle = () => {
    soundFx.playClick()
    setIsConsoleFrame((prev) => !prev)
  }

  return (
    <header className="pokedex-header pixel-box">
      <div className="header-top-row">
        {/* Brand / Logo */}
        <div className="pokedex-brand">
          <div className="pokedex-led-sensor">
            <div className="main-lens-blue"></div>
            <div className="mini-led led-red"></div>
            <div className="mini-led led-yellow"></div>
            <div className="mini-led led-green"></div>
          </div>

          <div className="pokedex-title-group">
            <h1 className="pokedex-title">POKÉDEX</h1>
            <span className="pokedex-subtitle">GAMEBOY EDITION • KANTO REGION</span>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="header-quick-tools">
          {/* Random Pokemon Button */}
          <button
            type="button"
            className="pixel-btn tool-btn"
            onClick={handleRandom}
            title="Escolher Pokémon Aleatório"
          >
            <Dices size={14} />
            <span className="tool-text">ALEATÓRIO</span>
          </button>

          {/* Theme Cycler */}
          <button
            type="button"
            className="pixel-btn tool-btn"
            onClick={cycleTheme}
            title="Alternar tema visual"
          >
            <Palette size={14} />
            <span className="tool-text">TEMA</span>
          </button>

          {/* Mute Button */}
          <button
            type="button"
            className={`pixel-btn tool-btn ${isMuted ? 'muted' : ''}`}
            onClick={handleMuteToggle}
            title={isMuted ? 'Ativar sons 8-bit' : 'Silenciar sons'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="tool-text">{isMuted ? 'MUDO' : 'SOM'}</span>
          </button>

          {/* Console Shell Toggle */}
          <button
            type="button"
            className={`pixel-btn tool-btn ${isConsoleFrame ? 'primary' : ''}`}
            onClick={handleFrameToggle}
            title={isConsoleFrame ? 'Alternar para tela cheia expandida' : 'Alternar para carcaça do GameBoy'}
          >
            {isConsoleFrame ? <Monitor size={14} /> : <Smartphone size={14} />}
            <span className="tool-text">{isConsoleFrame ? 'TELA CHEIA' : 'GAMEBOY'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="header-nav-tabs">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'pokedex' ? 'active' : ''}`}
          onClick={() => handleTabChange('pokedex')}
        >
          <List size={16} />
          <span>POKÉDEX</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'trainers' ? 'active' : ''}`}
          onClick={() => handleTabChange('trainers')}
        >
          <Award size={16} />
          <span>TREINADORES</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'battle' ? 'active' : ''}`}
          onClick={() => handleTabChange('battle')}
        >
          <Swords size={16} />
          <span>ARENA BATALHA</span>
        </button>
      </nav>
    </header>
  )
}
