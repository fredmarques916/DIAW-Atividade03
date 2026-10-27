// Pokémon data formatting, sprites, type palettes, and stat helpers

export const TYPE_COLORS = {
  normal: { bg: '#A8A878', border: '#6D6D4E', text: '#FFFFFF', icon: '⚪' },
  fire: { bg: '#F08030', border: '#9C531F', text: '#FFFFFF', icon: '🔥' },
  water: { bg: '#6890F0', border: '#445E9C', text: '#FFFFFF', icon: '💧' },
  grass: { bg: '#78C850', border: '#4E8234', text: '#FFFFFF', icon: '🌱' },
  electric: { bg: '#F8D030', border: '#A1871F', text: '#332200', icon: '⚡' },
  ice: { bg: '#98D8D8', border: '#638D8D', text: '#113333', icon: '❄️' },
  fighting: { bg: '#C03028', border: '#7D1F1A', text: '#FFFFFF', icon: '🥊' },
  poison: { bg: '#A040A0', border: '#682A68', text: '#FFFFFF', icon: '☠️' },
  ground: { bg: '#E0C068', border: '#927D44', text: '#2A2008', icon: '🏜️' },
  flying: { bg: '#A890F0', border: '#6D5E9C', text: '#FFFFFF', icon: '🦅' },
  psychic: { bg: '#F85888', border: '#A13959', text: '#FFFFFF', icon: '🔮' },
  bug: { bg: '#A8B820', border: '#6D7815', text: '#FFFFFF', icon: '🐛' },
  rock: { bg: '#B8A038', border: '#786824', text: '#FFFFFF', icon: '🪨' },
  ghost: { bg: '#705898', border: '#493963', text: '#FFFFFF', icon: '👻' },
  dark: { bg: '#705848', border: '#49392F', text: '#FFFFFF', icon: '🌑' },
  dragon: { bg: '#7038F8', border: '#4924A1', text: '#FFFFFF', icon: '🐉' },
  steel: { bg: '#B8B8D0', border: '#787887', text: '#222233', icon: '⚙️' },
  fairy: { bg: '#EE99AC', border: '#9B6470', text: '#FFFFFF', icon: '✨' },
  typeless: { bg: '#68A090', border: '#44685E', text: '#FFFFFF', icon: '❓' }
}

export function getTypeStyle(typeName = '') {
  const key = (typeName || '').toLowerCase()
  return TYPE_COLORS[key] || { bg: '#777777', border: '#444444', text: '#FFFFFF', icon: '🏷️' }
}

export function formatPokemonId(id) {
  return `#${String(id).padStart(3, '0')}`
}

export function getPokemonSprite(id, style = 'artwork') {
  if (style === 'retro') {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${id}.png`
  }
  if (style === 'pixel') {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  }
  // Default: official-artwork with high quality
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export const STAT_CONFIG = [
  { key: 'hp', label: 'HP', fullLabel: 'Pontos de Vida', max: 160, color: '#FF5959' },
  { key: 'attack', label: 'ATK', fullLabel: 'Ataque', max: 160, color: '#F5AC78' },
  { key: 'defense', label: 'DEF', fullLabel: 'Defesa', max: 160, color: '#FAE078' },
  { key: 'specialAttack', label: 'SP. ATK', fullLabel: 'Ataque Especial', max: 160, color: '#9DB7F5' },
  { key: 'specialDefense', label: 'SP. DEF', fullLabel: 'Defesa Especial', max: 160, color: '#A7DB8D' },
  { key: 'speed', label: 'SPD', fullLabel: 'Velocidade', max: 160, color: '#FA92B2' }
]

export function calculateBST(stats = {}) {
  return (
    (stats.hp || 0) +
    (stats.attack || 0) +
    (stats.defense || 0) +
    (stats.specialAttack || 0) +
    (stats.specialDefense || 0) +
    (stats.speed || 0)
  )
}
