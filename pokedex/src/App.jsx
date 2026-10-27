import { useState, useEffect, useMemo, useCallback } from 'react'
import pokedexData from './data/pokedex-data.json'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import TypeFilter from './components/TypeFilter'
import SortControl from './components/SortControl'
import PokemonList from './components/PokemonList'
import PokemonDetailsModal from './components/PokemonDetailsModal'
import TrainersView from './components/TrainersView'
import PokemonComparison from './components/PokemonComparison'
import GameBoyShell from './components/GameBoyShell'
import { soundFx } from './utils/soundEffects'
import { calculateBST } from './utils/pokemonHelpers'
import './App.css'

const allPokemon = pokedexData.pokemon || []
const allTypes = pokedexData.types || []
const allTrainers = pokedexData.trainers || []

export default function App() {

  // Main navigation tab: 'pokedex' | 'trainers' | 'battle'
  const [activeTab, setActiveTab] = useState('pokedex')

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')

  // Sorting state
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('pokedex_retro_favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  // Visual Sprite Style: 'artwork' | 'retro' | 'pixel'
  const [spriteStyle, setSpriteStyle] = useState('artwork')

  // Selected Pokemon for Details Modal
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  // Compare List for Battle Arena (up to 2 pokemon)
  const [compareList, setCompareList] = useState([])

  // Theme state: 'kanto' | 'dmg' | 'color' | 'dark'
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('pokedex_retro_theme') || 'kanto'
  })

  // Sound Muted state
  const [isMuted, setIsMuted] = useState(() => soundFx.isMuted())

  // GameBoy Handheld Shell Frame vs Full-Screen Mode
  const [isConsoleFrame, setIsConsoleFrame] = useState(() => {
    const saved = localStorage.getItem('pokedex_console_frame')
    return saved !== null ? saved === 'true' : false
  })

  // Synchronize theme attribute to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('pokedex_retro_theme', currentTheme)
  }, [currentTheme])

  // Persist console frame preference
  useEffect(() => {
    localStorage.setItem('pokedex_console_frame', String(isConsoleFrame))
  }, [isConsoleFrame])

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('pokedex_retro_favorites', JSON.stringify(favorites))
    } catch {
      // Ignore storage errors
    }
  }, [favorites])

  // Toggle Favorite
  const handleToggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  // Toggle Pokémon in Comparison list
  const handleToggleCompare = useCallback((pokemon) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === pokemon.id)
      if (exists) {
        return prev.filter((p) => p.id !== pokemon.id)
      }
      if (prev.length >= 2) {
        // Replace second pokemon
        return [prev[0], pokemon]
      }
      return [...prev, pokemon]
    })
  }, [])

  // Sound Mute Toggle
  const handleToggleMute = useCallback(() => {
    const next = soundFx.toggleMute()
    setIsMuted(next)
  }, [])

  // Filter and Sort Pokemon
  const filteredAndSortedPokemon = useMemo(() => {
    return allPokemon
      .filter((p) => {
        // 1. Search term filter (by Name or ID)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim()
          const matchesName = p.name.toLowerCase().includes(term)
          const matchesId = String(p.id).includes(term)
          if (!matchesName && !matchesId) return false
        }

        // 2. Type filter
        if (selectedType) {
          const hasType = p.types.some(
            (t) => t.name.toLowerCase() === selectedType.toLowerCase()
          )
          if (!hasType) return false
        }

        // 3. Favorites filter
        if (showOnlyFavorites) {
          if (!favorites.includes(p.id)) return false
        }

        return true
      })
      .sort((a, b) => {
        let diff = 0
        if (sortBy === 'id') {
          diff = a.id - b.id
        } else if (sortBy === 'name') {
          diff = a.name.localeCompare(b.name)
        } else if (sortBy === 'bst') {
          diff = calculateBST(a.stats) - calculateBST(b.stats)
        } else if (a.stats[sortBy] !== undefined && b.stats[sortBy] !== undefined) {
          diff = a.stats[sortBy] - b.stats[sortBy]
        }

        return sortOrder === 'asc' ? diff : -diff
      })
  }, [searchTerm, selectedType, showOnlyFavorites, favorites, sortBy, sortOrder])

  // Modal navigation handlers
  const currentModalIndex = useMemo(() => {
    if (!selectedPokemon) return -1
    return filteredAndSortedPokemon.findIndex((p) => p.id === selectedPokemon.id)
  }, [selectedPokemon, filteredAndSortedPokemon])

  const handleNavigatePrev = useCallback(() => {
    if (filteredAndSortedPokemon.length === 0) return
    const prevIndex =
      currentModalIndex <= 0
        ? filteredAndSortedPokemon.length - 1
        : currentModalIndex - 1
    setSelectedPokemon(filteredAndSortedPokemon[prevIndex])
  }, [currentModalIndex, filteredAndSortedPokemon])

  const handleNavigateNext = useCallback(() => {
    if (filteredAndSortedPokemon.length === 0) return
    const nextIndex =
      currentModalIndex >= filteredAndSortedPokemon.length - 1
        ? 0
        : currentModalIndex + 1
    setSelectedPokemon(filteredAndSortedPokemon[nextIndex])
  }, [currentModalIndex, filteredAndSortedPokemon])

  // Random Pokémon dice button
  const handlePickRandom = useCallback(() => {
    if (allPokemon.length === 0) return
    const randomIndex = Math.floor(Math.random() * allPokemon.length)
    setSelectedPokemon(allPokemon[randomIndex])
  }, [])

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedType('')
    setShowOnlyFavorites(false)
    setSortBy('id')
    setSortOrder('asc')
  }, [])

  // Content to render depending on activeTab
  const renderTabContent = () => {
    if (activeTab === 'trainers') {
      return (
        <TrainersView
          trainers={allTrainers}
          allPokemon={allPokemon}
          onSelectPokemon={setSelectedPokemon}
        />
      )
    }

    if (activeTab === 'battle') {
      return (
        <PokemonComparison
          allPokemon={allPokemon}
          compareList={compareList}
          onSetCompareList={setCompareList}
          onOpenDetails={setSelectedPokemon}
        />
      )
    }

    // Default: 'pokedex'
    return (
      <>
        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalResults={filteredAndSortedPokemon.length}
          totalPokemon={allPokemon.length}
        />

        {/* Type Filter */}
        <TypeFilter
          types={allTypes}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          pokemonList={allPokemon}
        />

        {/* Sort & Display Controls */}
        <SortControl
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          showOnlyFavorites={showOnlyFavorites}
          setShowOnlyFavorites={setShowOnlyFavorites}
          favoritesCount={favorites.length}
          spriteStyle={spriteStyle}
          setSpriteStyle={setSpriteStyle}
        />

        {/* Pokemon Cards List */}
        <PokemonList
          pokemon={filteredAndSortedPokemon}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          compareList={compareList}
          onToggleCompare={handleToggleCompare}
          onOpenDetails={setSelectedPokemon}
          spriteStyle={spriteStyle}
          onResetFilters={handleResetFilters}
        />
      </>
    )
  }

  const mainView = (
    <div className="main-content-area">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onPickRandom={handlePickRandom}
        isConsoleFrame={isConsoleFrame}
        setIsConsoleFrame={setIsConsoleFrame}
      />

      {renderTabContent()}
    </div>
  )

  return (
    <div className="app-root">
      {isConsoleFrame ? (
        <GameBoyShell
          onDpadUp={() => {}}
          onDpadDown={() => {}}
          onDpadLeft={() => {
            if (activeTab === 'battle') setActiveTab('trainers')
            else if (activeTab === 'trainers') setActiveTab('pokedex')
          }}
          onDpadRight={() => {
            if (activeTab === 'pokedex') setActiveTab('trainers')
            else if (activeTab === 'trainers') setActiveTab('battle')
          }}
          onBtnA={() => {
            if (!selectedPokemon && filteredAndSortedPokemon.length > 0) {
              setSelectedPokemon(filteredAndSortedPokemon[0])
            }
          }}
          onBtnB={() => {
            if (selectedPokemon) setSelectedPokemon(null)
          }}
          onSelect={() => {
            const themes = ['kanto', 'dmg', 'color', 'dark']
            const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length
            setCurrentTheme(themes[nextIdx])
          }}
          onStart={handlePickRandom}
        >
          {mainView}
        </GameBoyShell>
      ) : (
        <div className="standalone-viewport scanlines">
          {mainView}
        </div>
      )}

      {/* Details Modal */}
      {selectedPokemon && (
        <PokemonDetailsModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          isFavorite={favorites.includes(selectedPokemon.id)}
          onToggleFavorite={handleToggleFavorite}
          isSelectedForCompare={compareList.some((p) => p.id === selectedPokemon.id)}
          onToggleCompare={handleToggleCompare}
          onNavigatePrev={handleNavigatePrev}
          onNavigateNext={handleNavigateNext}
          trainers={allTrainers}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p className="footer-text">
          🎮 POKÉDEX GAMEBOY 2D • DESENVOLVIMENTO E INTEGRAÇÃO DE APLICAÇÕES WEB (DIAW)
        </p>
        <p className="footer-subtext">
          Desenvolvido com React + Vite • Áudio Chiptune Web Audio API • Dados de Kanto (151 Pokémon)
        </p>
      </footer>
    </div>
  )
}
