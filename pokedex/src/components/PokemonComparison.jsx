import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Swords, Trophy, RotateCcw } from 'lucide-react'
import {
  formatPokemonId,
  getPokemonSprite,
  getTypeStyle,
  STAT_CONFIG,
  calculateBST
} from '../utils/pokemonHelpers'
import { soundFx } from '../utils/soundEffects'
import './PokemonComparison.css'

export default function PokemonComparison({
  allPokemon = [],
  compareList = [],
  onSetCompareList,
  onOpenDetails
}) {
  const [manualFighterAId, setManualFighterAId] = useState(null)
  const [manualFighterBId, setManualFighterBId] = useState(null)

  const pokemonAId = manualFighterAId ?? compareList[0]?.id ?? allPokemon[0]?.id ?? 1
  const pokemonBId = manualFighterBId ?? compareList[1]?.id ?? allPokemon[3]?.id ?? 4

  const pokeA = allPokemon.find((p) => p.id === Number(pokemonAId)) || allPokemon[0]
  const pokeB = allPokemon.find((p) => p.id === Number(pokemonBId)) || allPokemon[3]

  const bstA = calculateBST(pokeA?.stats)
  const bstB = calculateBST(pokeB?.stats)

  // Overall winner based on BST or stat wins
  let scoreA = 0
  let scoreB = 0
  STAT_CONFIG.forEach(({ key }) => {
    const valA = pokeA?.stats[key] || 0
    const valB = pokeB?.stats[key] || 0
    if (valA > valB) scoreA++
    else if (valB > valA) scoreB++
  })

  const winner = scoreA > scoreB ? pokeA : scoreB > scoreA ? pokeB : null

  // Celebrate on comparison change
  const triggerVictory = () => {
    soundFx.playVictory()
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const handleSelectA = (e) => {
    const id = Number(e.target.value)
    setManualFighterAId(id)
    soundFx.playClick()
    if (onSetCompareList) {
      const match = allPokemon.find((p) => p.id === id)
      if (match) onSetCompareList([match, pokeB])
    }
  }

  const handleSelectB = (e) => {
    const id = Number(e.target.value)
    setManualFighterBId(id)
    soundFx.playClick()
    if (onSetCompareList) {
      const match = allPokemon.find((p) => p.id === id)
      if (match) onSetCompareList([pokeA, match])
    }
  }

  const handleSwap = () => {
    soundFx.playClick()
    setManualFighterAId(pokemonBId)
    setManualFighterBId(pokemonAId)
    if (onSetCompareList) {
      onSetCompareList([pokeB, pokeA])
    }
  }

  return (
    <div className="battle-arena-wrapper">
      {/* Arena Banner */}
      <div className="arena-header-banner pixel-box">
        <div className="arena-title-wrap">
          <Swords className="swords-icon" size={24} />
          <div>
            <h2 className="arena-title">ARENA DE COMPARAÇÃO DE BATALHA</h2>
            <p className="arena-subtitle">
              Coloque dois Pokémon lado a lado para confrontar seus atributos e simular o confronto!
            </p>
          </div>
        </div>

        <div className="arena-actions">
          <button
            type="button"
            className="pixel-btn primary"
            onClick={triggerVictory}
          >
            <Trophy size={14} /> CELEBRAR VENCEDOR
          </button>
          <button
            type="button"
            className="pixel-btn"
            onClick={handleSwap}
            title="Inverter lados"
          >
            <RotateCcw size={14} /> INVERTER
          </button>
        </div>
      </div>

      {/* Fighters Selectors & Cards */}
      <div className="battle-clash-grid">
        {/* Fighter A */}
        <div className="fighter-card pixel-box">
          <div className="fighter-select-bar">
            <span className="fighter-slot-tag">LUTADOR 1:</span>
            <select
              value={pokemonAId}
              onChange={handleSelectA}
              className="fighter-dropdown"
            >
              {allPokemon.map((p) => (
                <option key={p.id} value={p.id}>
                  {formatPokemonId(p.id)} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div
            className="fighter-sprite-stage"
            onClick={() => onOpenDetails(pokeA)}
            title="Clique para ver detalhes completos"
          >
            <img
              src={getPokemonSprite(pokeA.id, 'artwork')}
              alt={pokeA.name}
              className="fighter-img"
            />
          </div>

          <div className="fighter-name-bar">
            <h3 className="fighter-name">{pokeA.name}</h3>
            <span className="fighter-id">{formatPokemonId(pokeA.id)}</span>
          </div>

          <div className="fighter-types-row">
            {pokeA.types.map((t) => {
              const s = getTypeStyle(t.name)
              return (
                <span
                  key={t.name}
                  className="pixel-badge"
                  style={{
                    backgroundColor: s.bg,
                    color: s.text,
                    borderColor: '#000'
                  }}
                >
                  {s.icon} {t.name}
                </span>
              )
            })}
          </div>

          <div className="fighter-score-badge">
            VITÓRIAS EM ATRIBUTOS: <strong>{scoreA}</strong>
          </div>
        </div>

        {/* VS Center Badge */}
        <div className="battle-vs-center">
          <div className="vs-circle pixel-box">VS</div>
          {winner && (
            <div className="winner-declaration pixel-box-sm">
              <Trophy size={16} color="#f59e0b" />
              <span>VENCEDOR:</span>
              <strong>{winner.name.toUpperCase()}</strong>
            </div>
          )}
        </div>

        {/* Fighter B */}
        <div className="fighter-card pixel-box">
          <div className="fighter-select-bar">
            <span className="fighter-slot-tag">LUTADOR 2:</span>
            <select
              value={pokemonBId}
              onChange={handleSelectB}
              className="fighter-dropdown"
            >
              {allPokemon.map((p) => (
                <option key={p.id} value={p.id}>
                  {formatPokemonId(p.id)} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div
            className="fighter-sprite-stage"
            onClick={() => onOpenDetails(pokeB)}
            title="Clique para ver detalhes completos"
          >
            <img
              src={getPokemonSprite(pokeB.id, 'artwork')}
              alt={pokeB.name}
              className="fighter-img"
            />
          </div>

          <div className="fighter-name-bar">
            <h3 className="fighter-name">{pokeB.name}</h3>
            <span className="fighter-id">{formatPokemonId(pokeB.id)}</span>
          </div>

          <div className="fighter-types-row">
            {pokeB.types.map((t) => {
              const s = getTypeStyle(t.name)
              return (
                <span
                  key={t.name}
                  className="pixel-badge"
                  style={{
                    backgroundColor: s.bg,
                    color: s.text,
                    borderColor: '#000'
                  }}
                >
                  {s.icon} {t.name}
                </span>
              )
            })}
          </div>

          <div className="fighter-score-badge">
            VITÓRIAS EM ATRIBUTOS: <strong>{scoreB}</strong>
          </div>
        </div>
      </div>

      {/* Head-to-Head Stats Comparison Table */}
      <div className="stats-comparison-card pixel-box">
        <h4 className="stats-table-title">CONFRONTO DE ATRIBUTOS PONTO A PONTO</h4>

        <div className="stats-comparison-table">
          {STAT_CONFIG.map(({ key, label, fullLabel, max, color }) => {
            const valA = pokeA.stats[key] || 0
            const valB = pokeB.stats[key] || 0
            const aWins = valA > valB
            const bWins = valB > valA
            const pctA = Math.min(100, Math.round((valA / max) * 100))
            const pctB = Math.min(100, Math.round((valB / max) * 100))

            return (
              <div key={key} className="comparison-stat-row">
                {/* Fighter A Stat */}
                <div className={`comp-val col-left ${aWins ? 'winner' : ''}`}>
                  <span className="comp-number">{valA}</span>
                  <div className="comp-bar-track mirror">
                    <div
                      className="comp-bar-fill"
                      style={{
                        width: `${pctA}%`,
                        backgroundColor: aWins ? '#10b981' : color
                      }}
                    />
                  </div>
                </div>

                {/* Center Stat Name */}
                <div className="comp-label-col">
                  <span className="comp-stat-code">{label}</span>
                  <span className="comp-stat-sub">{fullLabel}</span>
                </div>

                {/* Fighter B Stat */}
                <div className={`comp-val col-right ${bWins ? 'winner' : ''}`}>
                  <div className="comp-bar-track">
                    <div
                      className="comp-bar-fill"
                      style={{
                        width: `${pctB}%`,
                        backgroundColor: bWins ? '#10b981' : color
                      }}
                    />
                  </div>
                  <span className="comp-number">{valB}</span>
                </div>
              </div>
            )
          })}

          {/* BST Total Row */}
          <div className="comparison-stat-row bst-row">
            <div className={`comp-val col-left ${bstA > bstB ? 'winner' : ''}`}>
              <span className="comp-number bst-val">{bstA}</span>
            </div>

            <div className="comp-label-col bst-label">
              <span className="comp-stat-code">TOTAL (BST)</span>
            </div>

            <div className={`comp-val col-right ${bstB > bstA ? 'winner' : ''}`}>
              <span className="comp-number bst-val">{bstB}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
