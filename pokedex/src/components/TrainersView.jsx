import { useState } from 'react'
import { Award, Search } from 'lucide-react'
import {
  formatPokemonId,
  getPokemonSprite,
  getTypeStyle
} from '../utils/pokemonHelpers'
import { soundFx } from '../utils/soundEffects'
import './TrainersView.css'

// Trainer lore / title mapping for extra retro RPG flavor
const TRAINER_LORE = {
  Ash: { title: 'Treinador de Pallet Town', gym: 'Protagonista', badgeName: 'Insígnias de Kanto' },
  Brock: { title: 'Líder de Ginásio de Pewter', gym: 'Tipo Pedra', badgeName: 'Insígnia da Rocha' },
  Misty: { title: 'Líder de Ginásio de Cerulean', gym: 'Tipo Água', badgeName: 'Insígnia da Cascata' },
  'Lt. Surge': { title: 'Líder de Ginásio de Vermilion', gym: 'Tipo Elétrico', badgeName: 'Insígnia do Trovão' },
  Erika: { title: 'Líder de Ginásio de Celadon', gym: 'Tipo Planta', badgeName: 'Insígnia do Arco-Íris' },
  Koga: { title: 'Líder de Ginásio de Fuchsia', gym: 'Tipo Veneno', badgeName: 'Insígnia da Alma' },
  Sabrina: { title: 'Líder de Ginásio de Saffron', gym: 'Tipo Psíquico', badgeName: 'Insígnia do Pântano' },
  Blaine: { title: 'Líder de Ginásio de Cinnabar', gym: 'Tipo Fogo', badgeName: 'Insígnia do Vulcão' },
  Giovanni: { title: 'Líder de Ginásio de Viridian & Líder Rocket', gym: 'Tipo Terrestre', badgeName: 'Insígnia da Terra' },
  Gary: { title: 'Rival de Pallet Town', gym: 'Campeão / Pesquisador', badgeName: 'Insígnias Oficiais' },
  'Team Rocket': { title: 'Jessie & James / Organização Vilã', gym: 'Membros da Equipe Rocket', badgeName: 'Sem Insígnias' },
  Lance: { title: 'Mestre da Elite dos Quatro', gym: 'Mestre dos Dragões', badgeName: 'Insígnias de Campeão' }
}

export default function TrainersView({
  trainers = [],
  allPokemon = [],
  onSelectPokemon
}) {
  const [trainerSearch, setTrainerSearch] = useState('')

  // Map pokemon id to full pokemon object
  const pokemonMap = new Map(allPokemon.map((p) => [p.id, p]))

  const filteredTrainers = trainers.filter((t) =>
    t.name.toLowerCase().includes(trainerSearch.toLowerCase())
  )

  const handlePokemonClick = (pokemon) => {
    soundFx.playSelect()
    onSelectPokemon(pokemon)
  }

  return (
    <div className="trainers-view-wrapper">
      {/* Trainers View Header */}
      <div className="trainers-header-box pixel-box">
        <div className="trainers-header-info">
          <h2 className="trainers-title">
            <Award className="title-icon" size={20} />
            REGISTRO DE TREINADORES DE KANTO
          </h2>
          <p className="trainers-subtitle">
            Consulte os maiores treinadores, líderes de ginásio e suas equipes de Pokémon registradas na Pokédex.
          </p>
        </div>

        {/* Search input for trainers */}
        <div className="trainers-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={trainerSearch}
            onChange={(e) => setTrainerSearch(e.target.value)}
            placeholder="Pesquisar treinador..."
            className="trainers-search-input"
          />
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="trainers-grid">
        {filteredTrainers.map((trainer) => {
          const lore = TRAINER_LORE[trainer.name] || {
            title: 'Treinador Pokémon',
            gym: 'Kanto',
            badgeName: 'Insígnias'
          }

          // Resolve pokemon objects for this trainer
          const team = (trainer.pokemonIds || []).map((id) => pokemonMap.get(id)).filter(Boolean)

          return (
            <div key={trainer.id} className="trainer-card pixel-box">
              {/* Trainer Header */}
              <div className="trainer-card-header">
                <div className="trainer-avatar-box">
                  <span className="trainer-avatar-emoji">
                    {trainer.name.includes('Rocket') ? '🚀' : trainer.badges >= 8 ? '👑' : '🧢'}
                  </span>
                </div>
                <div className="trainer-meta">
                  <h3 className="trainer-name">{trainer.name}</h3>
                  <span className="trainer-title-badge">{lore.title}</span>
                  <span className="trainer-gym-badge">{lore.gym}</span>
                </div>

                <div className="trainer-badges-counter" title={`${trainer.badges} insígnias conquistadas`}>
                  <Award size={18} color="#f59e0b" />
                  <span className="badges-number">{trainer.badges}</span>
                  <span className="badges-text">INSÍGNIAS</span>
                </div>
              </div>

              {/* Gym Badges Display */}
              <div className="trainer-badges-row">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className={`gym-badge-icon ${i < trainer.badges ? 'earned' : 'locked'}`}
                    title={i < trainer.badges ? `Insígnia ${i + 1} Conquistada` : 'Não obtida'}
                  >
                    🏅
                  </span>
                ))}
              </div>

              {/* Team Section */}
              <div className="trainer-team-section">
                <div className="team-header-line">
                  <span className="team-title">EQUIPE REGISTRADA ({team.length})</span>
                  <span className="team-hint">Clique para inspecionar</span>
                </div>

                <div className="team-pokemon-list">
                  {team.map((poke, index) => {
                    return (
                      <div
                        key={`${trainer.id}-${poke.id}-${index}`}
                        className="team-pokemon-item pixel-box-sm"
                        onClick={() => handlePokemonClick(poke)}
                        title={`Ver detalhes de ${poke.name}`}
                      >
                        <div className="team-sprite-wrap">
                          <img
                            src={getPokemonSprite(poke.id, 'artwork')}
                            alt={poke.name}
                            className="team-poke-sprite"
                            loading="lazy"
                          />
                        </div>
                        <div className="team-poke-info">
                          <span className="team-poke-id">{formatPokemonId(poke.id)}</span>
                          <span className="team-poke-name">{poke.name}</span>
                          <div className="team-poke-types">
                            {poke.types.map((t) => {
                              const s = getTypeStyle(t.name)
                              return (
                                <span
                                  key={t.name}
                                  className="mini-type-dot"
                                  style={{ backgroundColor: s.bg }}
                                  title={t.name}
                                />
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
