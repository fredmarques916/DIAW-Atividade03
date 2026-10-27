import PokemonCard from './PokemonCard'
import { soundFx } from '../utils/soundEffects'
import './PokemonList.css'

export default function PokemonList({
  pokemon = [],
  favorites = [],
  onToggleFavorite,
  compareList = [],
  onToggleCompare,
  onOpenDetails,
  spriteStyle = 'artwork',
  onResetFilters
}) {
  if (pokemon.length === 0) {
    return (
      <div className="empty-pokemon-state pixel-box">
        <div className="empty-pixel-icon">❓</div>
        <h3 className="empty-title">NENHUM POKÉMON ENCONTRADO!</h3>
        <p className="empty-desc">
          O radar da Pokédex não detectou nenhuma criatura correspondente aos filtros atuais.
        </p>
        {onResetFilters && (
          <button
            type="button"
            className="pixel-btn primary"
            onClick={() => {
              soundFx.playBack()
              onResetFilters()
            }}
          >
            ↺ RESTAURAR TODOS OS POKÉMON
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="pokemon-grid">
      {pokemon.map((p) => {
        const isFav = favorites.includes(p.id)
        const isComparing = compareList.some((item) => item.id === p.id)

        return (
          <PokemonCard
            key={p.id}
            pokemon={p}
            isFavorite={isFav}
            onToggleFavorite={onToggleFavorite}
            isSelectedForCompare={isComparing}
            onToggleCompare={onToggleCompare}
            onOpenDetails={onOpenDetails}
            spriteStyle={spriteStyle}
          />
        )
      })}
    </div>
  )
}
