export type Theme = 'mystery' | 'historical' | 'fantasy' | 'sci-fi' | 'comedy' | 'horror'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type PuzzleType = 'logic' | 'observation' | 'cipher' | 'deduction' | 'local' | 'wordplay' | 'math' | 'pattern' | 'physical' | 'social' | 'memory' | 'creative' | 'technology' | 'meta-puzzle'

export type PuzzleMechanic = 'multi-step' | 'progressive' | 'collaborative' | 'time-sensitive' | 'environmental' | 'cross-reference' | 'hybrid' | 'meta-puzzle' | 'red-herring' | 'progressive-difficulty'

export type PuzzleCategory = 'reasoning' | 'creative' | 'analytical' | 'contextual' | 'physical' | 'social' | 'technological'
export type VenueType = 'traditional-pub' | 'modern-bar' | 'gastropub' | 'brewery' | 'wine-bar' | 'cocktail-lounge'

export interface SplashScreen {
  title: string
  content: string
  mapsLink?: string
  videoLink?: string
  imageLink?: string
}

export interface Puzzle {
  id: string
  title: string
  narrative: string
  type: PuzzleType
  category: PuzzleCategory
  mechanics: PuzzleMechanic[] // Advanced puzzle mechanics
  content: string // The actual puzzle text/data
  answer: string
  clues: string[] // Progressive hints
  difficulty: number // 1-5 scale
  order: number
  localContext?: string // How this puzzle relates to the city specifically
  videoLink?: string
  imageLink?: string
  // Quality and validation fields
  qualityScore?: number // 1-10 quality rating
  estimatedSolveTime?: number // Minutes to solve
  requiresTeamwork?: boolean
  requiresPhysicalInteraction?: boolean
  requiresLocalKnowledge?: boolean
  isMultiStep?: boolean
  subPuzzles?: string[] // IDs of related sub-puzzles
  dependencies?: string[] // IDs of puzzles this depends on
  unlocks?: string[] // IDs of puzzles this unlocks
  // Advanced content
  materials?: string[] // Required materials or props
  instructions?: string // Special instructions for the puzzle
  validationCriteria?: string[] // How to validate the solution
}

export interface PubLocation {
  id: string
  order: number
  placeholderName: string // {PUB_1}, {PUB_2}, etc.
  actualName?: string
  venueType: VenueType
  narrative: string
  puzzles: Puzzle[]
  transitionText: string
  mapsLink?: string
  videoLink?: string
  imageLink?: string
  walkingTime?: string // Time to next pub
  areaDescription?: string // Description of the area/neighborhood
}

export interface LocationMapping {
  [key: string]: {
    name: string
    venueType: VenueType
    mapsLink?: string
    videoLink?: string
    imageLink?: string
  }
}

export interface Game {
  id: string
  title: string
  theme: Theme
  city: string
  difficulty: Difficulty
  estimatedDuration: number
  pubCount: number
  puzzlesPerPub: number
  content: {
    intro: SplashScreen
    locations: PubLocation[]
    resolution: SplashScreen
  }
  locationPlaceholders: LocationMapping
  routeInfo?: {
    totalDistance: string
    totalTime: string
    isValid: boolean
  }
  createdAt: string
  updatedAt: string
  userId: string
}


export interface UserProfile {
  id: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface AIGenerationRequest {
  theme: Theme
  city: string
  cityArea?: string // Specific area/neighborhood within the city
  difficulty: Difficulty
  pubCount: number
  puzzlesPerPub: number
  estimatedDuration: number
  customInstructions?: string
  simplifiedPrompt?: boolean // Use simplified prompt for retries
  // Puzzle preferences
  preferredPuzzleTypes?: PuzzleType[]
  preferredMechanics?: PuzzleMechanic[]
  difficultyRange?: [number, number] // [min, max] difficulty range
  includePhysicalPuzzles?: boolean
  includeSocialPuzzles?: boolean
  includeTechnologyPuzzles?: boolean
  requireTeamwork?: boolean
  requireLocalKnowledge?: boolean
}

export interface AIGenerationResponse {
  story: {
    title: string
    intro: SplashScreen
    resolution: SplashScreen
    characterTypes: string[]
  }
  locations: Omit<PubLocation, 'id' | 'puzzles'>[]
  puzzles: Omit<Puzzle, 'id'>[]
}

export interface GameGenerationStep {
  id: string
  title: string
  description: string
  completed: boolean
  data?: any
}

export interface GameGenerationState {
  currentStep: number
  steps: GameGenerationStep[]
  gameData: Partial<Game>
  isLoading: boolean
  error?: string
}
