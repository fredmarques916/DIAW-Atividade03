import { ArrowDownUp, Star, Sparkles, Image as ImageIcon } from 'lucide-react'
import { soundFx } from '../utils/soundEffects'
import './SortControl.css'

export default function SortControl({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showOnlyFavorites,
  setShowOnlyFavorites,
  favoritesCount,
  spriteStyle,
  setSpriteStyle
}) {
  const sortOptions = [
    { value: 'id', label: 'Nº Pokédex' },
    { value: 'name', label: 'Nome' },
    { value: 'hp', label: 'HP (Vida)' },
    { value: 'attack', label: 'Ataque' },
    { value: 'defense', label: 'Defesa' },
    { value: 'specialAttack', label: 'Atq. Especial' },
    { value: 'specialDefense', label: 'Def. Especial' },
    { value: 'speed', label: 'Velocidade' },
    { value: 'bst', label: 'Total (BST)' }
  ]

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    soundFx.playClick()
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    soundFx.playClick()
  }

  const toggleFavorites = () => {
    setShowOnlyFavorites((prev) => !prev)
    soundFx.playFavorite()
  }

  const toggleSpriteStyle = () => {
    setSpriteStyle((prev) => (prev === 'artwork' ? 'retro' : prev === 'retro' ? 'pixel' : 'artwork'))
    soundFx.playClick()
  }

  const getSpriteLabel = () => {
    if (spriteStyle === 'artwork') return 'HD Art'
    if (spriteStyle === 'retro') return 'GameBoy'
    return 'Pixel'
  }

  return (
    <div className="sort-controls-bar pixel-box-sm">
      <div className="sort-left-group">
        <label htmlFor="sort-select" className="sort-label">
          <ArrowDownUp size={14} /> ORDENAR:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={handleSortChange}
          className="pixel-select"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="order-toggle-btn"
          onClick={toggleSortOrder}
          title={`Ordem ${sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}`}
          aria-label="Alternar ordem de classificação"
        >
          {sortOrder === 'asc' ? '▲ ASC' : '▼ DESC'}
        </button>
      </div>

      <div className="sort-right-group">
        {/* Sprite Style Toggle */}
        <button
          type="button"
          className="retro-action-btn sprite-toggle-btn"
          onClick={toggleSpriteStyle}
          title="Alternar estilo visual das imagens"
        >
          <ImageIcon size={14} />
          <span>SPRITES: {getSpriteLabel()}</span>
        </button>

        {/* Favorites Filter Button */}
        <button
          type="button"
          className={`retro-action-btn fav-toggle-btn ${showOnlyFavorites ? 'active' : ''}`}
          onClick={toggleFavorites}
          title="Filtrar Pokémon favoritos"
        >
          <Star size={14} fill={showOnlyFavorites ? '#f59e0b' : 'none'} color={showOnlyFavorites ? '#f59e0b' : 'currentColor'} />
          <span>FAVORITOS ({favoritesCount})</span>
        </button>
      </div>
    </div>
  )
}
