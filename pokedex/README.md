# 🎮 Pokédex GameBoy 2D Edition — Atividade 03

> **Disciplina:** Desenvolvimento e Integração de Aplicações Web (DIAW)  
> **Tecnologias:** React 19 + Vite + Vanilla CSS (Design Tokens & Pixel Art) + Web Audio API  
> **Tema Visual:** Console Portátil Nintendo GameBoy & RPG Retrô 2D  

---

## 📸 Visão Geral da Aplicação

Uma Pokédex interativa e nostálgica construída com **React + Vite**, combinando os dados clássicos da 1ª Geração de Kanto (151 criaturas) com uma interface visual rica inspirada nos jogos de Pokémon para **GameBoy Color** e **GameBoy Clássico (DMG-01)**.

A aplicação conta com um sintetizador de efeitos sonoros **8-bit chiptune nativo** em Web Audio API, chassi interativo com botões físicos funcionais (D-Pad, A, B, Select, Start), filtros por tipo, pesquisa em tempo real, visualizador detalhado de atributos, catálogo de líderes de ginásio/treinadores e uma arena de comparação de batalha.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Gerenciador de pacotes `npm`

### 1. Clonar o Repositório e Acessar o Diretório
```bash
git clone https://github.com/fredmarques916/DIAW-Atividade03.git
cd DIAW-Atividade03/pokedex
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

### 4. Acessar no Navegador
Abra seu navegador no endereço indicado no terminal:
```text
http://localhost:5173/  (ou http://localhost:5174/)
```

### 5. Demais Comandos Disponíveis
```bash
# Validar código e verificar regras de lint sem erros:
npm run lint

# Gerar o bundle otimizado para produção:
npm run build

# Pré-visualizar a versão de produção:
npm run preview
```

---

## 🎯 Requisitos do Enunciado Atendidos

| Requisito do Enunciado | Status | Descrição na Solução |
| :--- | :---: | :--- |
| **React + Vite** | ✅ | Estrutura moderna baseada em componentes funcionais e hooks. |
| **Exibição dos Pokémon (`pokedex-data.json`)** | ✅ | 151 Pokémon carregados com renderização dinâmica e listas com `map()`. |
| **Atributos Mínimos por Card** | ✅ | ID (#001), Nome, Tipos, HP, Ataque, Defesa, Atq. Especial, Def. Especial e Velocidade. |
| **Pesquisa por Nome ou ID** | ✅ | Busca em tempo real com debounce natural, contador de encontrados e botão de limpeza. |
| **Filtro por Tipo** | ✅ | Chips retrô com as cores dos tipos oficiais e contadores de espécies. |
| **Visualização de Detalhes** | ✅ | Modal com CRT Scanlines, barras animadas de atributos, BST, alternador de sprites e áudio 8-bit. |
| **Área de Treinadores** | ✅ | Seção dedicada para os 12 treinadores/líderes (Ash, Brock, Misty, etc.), contagem de insígnias e equipe de Pokémon com cards clicáveis. |
| **Tratamento de Vazio** | ✅ | Tela retrô de "Nenhum Pokémon encontrado" com ação para restaurar filtros. |
| **Identidade Visual Própria** | ✅ | Estética 2D GameBoy autêntica com scanlines, LEDs, pixel art borders e fontes retrô. |
| **Responsividade** | ✅ | Layout adaptável para smartphones, tablets e desktops. |

---

## 🏆 Desafios Opcionais Implementados

- ⭐ **Sistema de Favoritos**: Marcação rápida com persistência no `localStorage` e filtro instantâneo `FAVORITOS (X)`.
- ⚔️ **Arena de Comparação de Batalha**: Seleção de dois Pokémon com confronto ponto a ponto de cada stat, identificador de vitória e celebração com confetes (`canvas-confetti`) e fanfarra 8-bit.
- 📊 **Ordenação Completa**: Classificação por Número (#), Nome (A-Z), HP, Ataque, Defesa, Atq. Especial, Def. Especial, Velocidade e Total (BST), com alternância entre Crescente e Decrescente.
- 🎲 **Dado / Pokémon Aleatório ("Surprise Me")**: Sorteador com efeito sonoro de dados que abre a ficha do Pokémon instantaneamente.
- 🎨 **Múltiplos Temas Retrô**:
  - `Kanto Red` (Pokédex Oficial clássica vermelha)
  - `GameBoy DMG-01` (Paleta autêntica verde de 4 tons LCD)
  - `Atomic Purple` (Roxo translúcido icônico do GameBoy Color)
  - `Dark Matrix` (Modo escuro com acentos em fósforo verde)
- 🖼️ **Alternador de Estilo de Sprites**:
  - `HD Art` (Arte oficial de alta definição)
  - `GameBoy` (Sprites transparentes originais das edições Red/Blue)
  - `Sprite` (Pixel art clássica)
- 🔊 **Sintetizador de Áudio 8-Bit (Web Audio API)**:
  - Cliques de botões, confirmação, cancelamento, chime de favoritos, fanfarra de vitória e grito único procedural por Pokémon, com botão de mudo persistente.
- 🕹️ **Carcaça GameBoy Interativa (Modo Handheld)**:
  - Modo alternável entre visualização em Tela Cheia e Carcaça Portátil com D-Pad e botões A/B interativos.

---

## 📁 Estrutura do Projeto

```text
pokedex/
├── public/
│   ├── favicon.svg             # Favicon pixel art em formato de Pokébola
│   └── icons.svg
├── src/
│   ├── assets/                 # Imagens e logos auxiliares
│   ├── components/             # Componentes React modulares
│   │   ├── GameBoyShell.jsx    # Carcaça e botões do GameBoy portátil
│   │   ├── GameBoyShell.css
│   │   ├── Header.jsx          # Topbar com LEDs, modos de exibição e áudio
│   │   ├── Header.css
│   │   ├── PokemonCard.jsx     # Card do Pokémon com todos os atributos
│   │   ├── PokemonCard.css
│   │   ├── PokemonComparison.jsx # Arena de comparação e batalha
│   │   ├── PokemonComparison.css
│   │   ├── PokemonDetailsModal.jsx # Ficha completa com barras e grito 8-bit
│   │   ├── PokemonDetailsModal.css
│   │   ├── PokemonList.jsx     # Grid responsivo e estado vazio
│   │   ├── PokemonList.css
│   │   ├── SearchBar.jsx       # Campo de busca por nome ou ID
│   │   ├── SearchBar.css
│   │   ├── SortControl.jsx     # Controles de ordenação e favoritos
│   │   ├── SortControl.css
│   │   ├── TrainersView.jsx    # Catálogo de treinadores e equipes
│   │   ├── TrainersView.css
│   │   ├── TypeFilter.jsx      # Filtros por tipo elemental
│   │   └── TypeFilter.css
│   ├── data/
│   │   └── pokedex-data.json   # Dados locais dos Pokémon, tipos e treinadores
│   ├── utils/
│   │   ├── pokemonHelpers.js   # Formatação de ID, cores de tipos e estatísticas
│   │   └── soundEffects.js     # Sintetizador chiptune via Web Audio API
│   ├── App.jsx                 # Componente raiz com estados globais
│   ├── App.css
│   ├── index.css               # Design Tokens, tipografia pixel art e temas
│   └── main.jsx
├── index.html                  # Metadados e importação de fontes Google
├── package.json                # Dependências do projeto
├── vite.config.js              # Configuração do Vite
└── README.md
```

---

## 🌐 Fontes de Dados e Imagens

- **Dados da Pokédex:** Arquivo local `pokedex-data.json` disponibilizado para a Atividade 03, garantindo funcionamento 100% autônomo e offline.
- **Sprites e Artes dos Pokémon:**
  - Imagens Oficiais: Repositório público PokéAPI Sprites (`PokeAPI/sprites`).
  - Sprites Retrô: Sprites da Geração 1 (Pokémon Red & Blue) da PokéAPI.
- **Tipografia:** Google Fonts (`Press Start 2P`, `Silkscreen`, `VT323`, `Outfit`).
- **Áudio:** Síntese em tempo real com osciladores de onda quadrada e triangular via `AudioContext` do navegador.

---

## 👥 Metodologia e Integrantes

Desenvolvido para a Atividade 03 da disciplina **Desenvolvimento e Integração de Aplicações Web** utilizando metodologia de **Pair Programming** com controle de versões semântico via Git.
