import { useEffect, useState } from 'react'
import {
  X,
  Volume2,
  Star,
  Swords,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react'
import {
  formatPokemonId,
  getPokemonSprite,
  getTypeStyle,
  STAT_CONFIG,
  calculateBST
} from '../utils/pokemonHelpers'
import { soundFx } from '../utils/soundEffects'
import './PokemonDetailsModal.css'

export default function PokemonDetailsModal({
  pokemon,
  onClose,
  isFavorite,
  onToggleFavorite,
  isSelectedForCompare,
  onToggleCompare,
  onNavigatePrev,
  onNavigateNext,
  trainers = []
}) {
  const [spriteMode, setSpriteMode] = useState('artwork') // artwork | retro | pixel
  const [imgLoaded, setImgLoaded] = useState(false)

  // Keyboard navigation: Escape closes, Left/Right navigates
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        soundFx.playBack()
        onClose()
      } else if (e.key === 'ArrowLeft' && onNavigatePrev) {
        soundFx.playClick()
        onNavigatePrev()
      } else if (e.key === 'ArrowRight' && onNavigateNext) {
        soundFx.playClick()
        onNavigateNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNavigatePrev, onNavigateNext])

  if (!pokemon) return null

  const primaryType = pokemon.types[0]?.name || 'normal'
  const primaryStyle = getTypeStyle(primaryType)
  const bst = calculateBST(pokemon.stats)

  // Find trainers that own this pokemon
  const associatedTrainers = trainers.filter((t) =>
    (t.pokemonIds || []).includes(pokemon.id)
  )

  const handlePlayCry = () => {
    soundFx.playCry(pokemon.id)
  }

  const handleFav = () => {
    soundFx.playFavorite()
    onToggleFavorite(pokemon.id)
  }

  const handleCompare = () => {
    soundFx.playClick()
    onToggleCompare(pokemon)
  }

  const spriteUrl = getPokemonSprite(pokemon.id, spriteMode)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container pixel-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--modal-accent': primaryStyle.bg,
          '--modal-border': primaryStyle.border
        }}
      >
        {/* Header Bar */}
        <div className="modal-header-bar">
          <div className="modal-title-group">
            <span className="modal-id-badge">{formatPokemonId(pokemon.id)}</span>
            <h2 className="modal-pokemon-name">{pokemon.name}</h2>
          </div>

          <div className="modal-top-actions">
            <button
              type="button"
              className={`modal-icon-btn ${isFavorite ? 'fav-active' : ''}`}
              onClick={handleFav}
              title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
              aria-label="Favoritar"
            >
              <Star
                size={18}
                fill={isFavorite ? '#f59e0b' : 'none'}
                color={isFavorite ? '#f59e0b' : 'currentColor'}
              />
            </button>

            <button
              type="button"
              className={`modal-icon-btn ${isSelectedForCompare ? 'compare-active' : ''}`}
              onClick={handleCompare}
              title="Comparar atributos"
              aria-label="Comparar"
            >
              <Swords size={18} />
            </button>

            <button
              type="button"
              className="modal-close-btn"
              onClick={() => {
                soundFx.playBack()
                onClose()
              }}
              title="Fechar (ESC)"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Main Body Grid */}
        <div className="modal-body-grid">
          {/* Left Column: Visual Showcase & Cry */}
          <div className="modal-left-col">
            <div className="modal-screen-display pixel-box-sm">
              <div className="crt-scanlines"></div>

              {/* Navigation arrows overlay */}
              {onNavigatePrev && (
                <button
                  type="button"
                  className="nav-arrow-btn left"
                  onClick={onNavigatePrev}
                  title="Pokémon Anterior (Seta Esquerda)"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              <img
                key={`${pokemon.id}-${spriteMode}`}
                src={spriteUrl}
                alt={pokemon.name}
                className={`modal-big-sprite ${imgLoaded ? 'loaded' : ''}`}
                onLoad={() => setImgLoaded(true)}
              />

              {onNavigateNext && (
                <button
                  type="button"
                  className="nav-arrow-btn right"
                  onClick={onNavigateNext}
                  title="Próximo Pokémon (Seta Direita)"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Sprite Switcher Tabs */}
            <div className="sprite-mode-selector">
              <button
                type="button"
                className={`mode-btn ${spriteMode === 'artwork' ? 'active' : ''}`}
                onClick={() => setSpriteMode('artwork')}
              >
                HD ART
              </button>
              <button
                type="button"
                className={`mode-btn ${spriteMode === 'retro' ? 'active' : ''}`}
                onClick={() => setSpriteMode('retro')}
              >
                GAMEBOY
              </button>
              <button
                type="button"
                className={`mode-btn ${spriteMode === 'pixel' ? 'active' : ''}`}
                onClick={() => setSpriteMode('pixel')}
              >
                SPRITE
              </button>
            </div>

            {/* 8-bit Cry Audio Button */}
            <button
              type="button"
              className="cry-sound-button pixel-btn primary"
              onClick={handlePlayCry}
            >
              <Volume2 size={16} />
              <span>OUVIR GRITO 8-BIT</span>
            </button>

            {/* Types Display */}
            <div className="modal-types-row">
              <span className="info-label">TIPOS:</span>
              <div className="modal-types-tags">
                {pokemon.types.map((type) => {
                  const s = getTypeStyle(type.name)
                  return (
                    <span
                      key={type.id || type.name}
                      className="pixel-badge"
                      style={{
                        backgroundColor: s.bg,
                        borderColor: '#000',
                        color: s.text
                      }}
                    >
                      {s.icon} {type.name}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Stats & Trainers */}
          <div className="modal-right-col">
            {/* Base Stats Header with BST */}
            <div className="stats-header-line">
              <span className="stats-box-title">
                <Zap size={14} /> ATRIBUTOS BASE
              </span>
              <span className="bst-chip">
                TOTAL (BST): <strong>{bst}</strong>
              </span>
            </div>

            {/* Stats Breakdown with Progress Bars */}
            <div className="detailed-stats-table pixel-box-sm">
              {STAT_CONFIG.map(({ key, label, fullLabel, max, color }) => {
                const val = pokemon.stats[key] ?? 0
                const pct = Math.min(100, Math.round((val / max) * 100))

                return (
                  <div key={key} className="stat-detail-row">
                    <div className="stat-info-head">
                      <span className="stat-code">{label}</span>
                      <span className="stat-full-name">{fullLabel}</span>
                    </div>

                    <div className="stat-bar-container">
                      <div
                        className="stat-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>

                    <span className="stat-number">{val}</span>
                  </div>
                )
              })}
            </div>

            {/* Trainers Association Section */}
            <div className="modal-trainers-section">
              <div className="trainers-box-header">
                <Shield size={14} /> TREINADORES RELACIONADOS
              </div>

              {associatedTrainers.length > 0 ? (
                <div className="associated-trainers-list">
                  {associatedTrainers.map((tr) => (
                    <div key={tr.id} className="trainer-pill-badge pixel-box-sm">
                      <span className="trainer-emoji">🧑‍🚀</span>
                      <span className="trainer-pill-name">{tr.name}</span>
                      <span className="trainer-pill-badges">🏅 {tr.badges}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-trainers-text">
                  Nenhum dos 12 líderes/treinadores principais de Kanto possui este Pokémon em sua equipe padrão.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer-nav">
          <div className="nav-keys-hint">
            <span>[←] ANTERIOR</span>
            <span>[→] PRÓXIMO</span>
            <span>[ESC] FECHAR</span>
          </div>

          <button
            type="button"
            className="pixel-btn"
            onClick={() => {
              soundFx.playBack()
              onClose()
            }}
          >
            VOLTAR AO MENU
          </button>
        </div>
      </div>
    </div>
  )
}
