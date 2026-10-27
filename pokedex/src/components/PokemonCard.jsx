import { useState } from 'react'
import { Star, Swords } from 'lucide-react'
import {
  formatPokemonId,
  getPokemonSprite,
  getTypeStyle,
  STAT_CONFIG
} from '../utils/pokemonHelpers'
import { soundFx } from '../utils/soundEffects'
import './PokemonCard.css'

export default function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  isSelectedForCompare,
  onToggleCompare,
  onOpenDetails,
  spriteStyle = 'artwork'
}) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const primaryType = pokemon.types[0]?.name || 'normal'
  const primaryStyle = getTypeStyle(primaryType)

  const handleCardClick = (e) => {
    // Prevent triggering if clicked on action buttons
    if (e.target.closest('button') || e.target.closest('input')) return
    soundFx.playSelect()
    onOpenDetails(pokemon)
  }

  const handleFavClick = (e) => {
    e.stopPropagation()
    soundFx.playFavorite()
    onToggleFavorite(pokemon.id)
  }

  const handleCompareClick = (e) => {
    e.stopPropagation()
    soundFx.playClick()
    onToggleCompare(pokemon)
  }

  // Fallback image source if primary style fails
  const spriteSrc = imgError
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    : getPokemonSprite(pokemon.id, spriteStyle)

  return (
    <div
      className={`pokemon-card pixel-box ${isSelectedForCompare ? 'comparing' : ''}`}
      onClick={handleCardClick}
      style={{
        '--card-accent': primaryStyle.bg,
        '--card-border': primaryStyle.border
      }}
    >
      {/* Top Bar: ID and Action Buttons */}
      <div className="card-top-bar">
        <span className="card-id">{formatPokemonId(pokemon.id)}</span>

        <div className="card-actions">
          <button
            type="button"
            className={`card-btn-action compare-btn ${isSelectedForCompare ? 'active' : ''}`}
            onClick={handleCompareClick}
            title={isSelectedForCompare ? 'Remover da comparação' : 'Adicionar para comparar'}
            aria-label="Comparar Pokémon"
          >
            <Swords size={12} />
          </button>

          <button
            type="button"
            className={`card-btn-action fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavClick}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-label="Favoritar Pokémon"
          >
            <Star
              size={13}
              fill={isFavorite ? '#f59e0b' : 'none'}
              color={isFavorite ? '#f59e0b' : 'currentColor'}
            />
          </button>
        </div>
      </div>

      {/* Sprite Frame with retro LCD background */}
      <div className="card-sprite-frame">
        <div className="sprite-screen-scanline"></div>
        {!imgLoaded && !imgError && (
          <div className="sprite-loading-pixel">CARREGANDO...</div>
        )}
        <img
          src={spriteSrc}
          alt={pokemon.name}
          className={`pokemon-sprite ${imgLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      </div>

      {/* Pokemon Name */}
      <h3 className="card-pokemon-name">{pokemon.name}</h3>

      {/* Type Badges */}
      <div className="card-types-list">
        {pokemon.types.map((type) => {
          const tStyle = getTypeStyle(type.name)
          return (
            <span
              key={type.id || type.name}
              className="card-type-chip"
              style={{
                backgroundColor: tStyle.bg,
                borderColor: tStyle.border,
                color: tStyle.text
              }}
            >
              {tStyle.icon} {type.name}
            </span>
          )
        })}
      </div>

      {/* Mandatory Stats Section (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) */}
      <div className="card-stats-grid">
        {STAT_CONFIG.map(({ key, label, max, color }) => {
          const val = pokemon.stats[key] ?? 0
          const pct = Math.min(100, Math.round((val / max) * 100))

          return (
            <div key={key} className="mini-stat-row">
              <span className="stat-label-col">{label}</span>
              <div className="stat-meter-track">
                <div
                  className="stat-meter-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color
                  }}
                />
              </div>
              <span className="stat-value-col">{val}</span>
            </div>
          )
        })}
      </div>

      {/* Bottom Hint */}
      <div className="card-bottom-hint">
        <span>PRESS A / CLIQUE P/ DETALHES</span>
      </div>
    </div>
  )
}
