import { getTypeStyle } from '../utils/pokemonHelpers'
import { soundFx } from '../utils/soundEffects'
import './TypeFilter.css'

export default function TypeFilter({
  types = [],
  selectedType,
  onSelectType,
  pokemonList = []
}) {
  // Calculate count per type
  const getTypeCount = (typeName) => {
    if (!typeName) return pokemonList.length
    return pokemonList.filter((p) =>
      p.types.some((t) => t.name.toLowerCase() === typeName.toLowerCase())
    ).length
  }

  const handleSelect = (typeName) => {
    soundFx.playSelect()
    onSelectType(selectedType === typeName ? '' : typeName)
  }

  // Filter out 'Typeless' if not used by any Pokémon
  const visibleTypes = types.filter(
    (t) => t.name.toLowerCase() !== 'typeless'
  )

  return (
    <div className="type-filter-container">
      <div className="type-filter-header">
        <span className="type-filter-title">FILTRAR POR TIPO:</span>
        {selectedType && (
          <button
            type="button"
            className="clear-type-btn"
            onClick={() => handleSelect('')}
          >
            [X LIMPAR FILTRO]
          </button>
        )}
      </div>

      <div className="type-chips-scroll">
        <button
          type="button"
          className={`type-chip ${!selectedType ? 'active' : ''}`}
          onClick={() => handleSelect('')}
          style={{
            borderColor: !selectedType ? 'var(--accent-gold)' : 'var(--screen-border)',
            background: !selectedType ? 'var(--accent-gold)' : 'var(--screen-surface)',
            color: !selectedType ? '#000' : 'var(--screen-text)'
          }}
        >
          <span className="type-icon">🌟</span>
          <span className="type-name">TODOS</span>
          <span className="type-count">({pokemonList.length})</span>
        </button>

        {visibleTypes.map((type) => {
          const style = getTypeStyle(type.name)
          const isSelected = selectedType?.toLowerCase() === type.name.toLowerCase()
          const count = getTypeCount(type.name)

          return (
            <button
              key={type.id || type.name}
              type="button"
              className={`type-chip ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelect(type.name)}
              style={{
                backgroundColor: isSelected ? style.bg : 'var(--screen-surface)',
                borderColor: isSelected ? '#000' : style.border,
                color: isSelected ? style.text : 'var(--screen-text)'
              }}
              title={`Filtrar por ${type.name}`}
            >
              <span className="type-icon">{style.icon}</span>
              <span className="type-name">{type.name}</span>
              <span className="type-count">({count})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
