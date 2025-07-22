export interface Player {
  id: string
  name: string
  color: string
  position: number
  isReady: boolean
}

export interface GameState {
  id: string
  players: Player[]
  currentPlayerIndex: number
  gameStatus: 'waiting' | 'playing' | 'finished'
  winner?: string
  lastDiceRoll?: number
  boardSize: number
}

export interface GameRoom {
  id: string
  code: string
  hostId: string
  gameState: GameState
  createdAt: number
}

export interface SnakeOrLadder {
  start: number
  end: number
  type: 'snake' | 'ladder'
}

export const PLAYER_COLORS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899'  // Pink
]

export const SNAKES_AND_LADDERS: SnakeOrLadder[] = [
  // Ladders
  { start: 4, end: 14, type: 'ladder' },
  { start: 9, end: 31, type: 'ladder' },
  { start: 20, end: 38, type: 'ladder' },
  { start: 28, end: 84, type: 'ladder' },
  { start: 40, end: 59, type: 'ladder' },
  { start: 51, end: 67, type: 'ladder' },
  { start: 63, end: 81, type: 'ladder' },
  { start: 71, end: 91, type: 'ladder' },
  
  // Snakes
  { start: 17, end: 7, type: 'snake' },
  { start: 54, end: 34, type: 'snake' },
  { start: 62, end: 19, type: 'snake' },
  { start: 64, end: 60, type: 'snake' },
  { start: 87, end: 24, type: 'snake' },
  { start: 93, end: 73, type: 'snake' },
  { start: 95, end: 75, type: 'snake' },
  { start: 99, end: 78, type: 'snake' }
]