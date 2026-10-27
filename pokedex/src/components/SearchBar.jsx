import { Search, X } from 'lucide-react'
import { soundFx } from '../utils/soundEffects'
import './SearchBar.css'

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  totalResults,
  totalPokemon
}) {
  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    soundFx.playClick()
  }

  const handleClear = () => {
    setSearchTerm('')
    soundFx.playBack()
  }

  return (
    <div className="search-bar-wrapper pixel-box-sm">
      <div className="search-input-group">
        <Search className="search-icon" size={18} />
        <input
          id="pokemon-search-input"
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Pesquisar por nome ou ID (ex: 25 ou Pikachu)..."
          aria-label="Pesquisar Pokémon"
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            title="Limpar pesquisa"
            aria-label="Limpar pesquisa"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="search-status-badge">
        <span className="results-count">
          {totalResults} / {totalPokemon}
        </span>
        <span className="results-label">ENCONTRADOS</span>
      </div>
    </div>
  )
}
