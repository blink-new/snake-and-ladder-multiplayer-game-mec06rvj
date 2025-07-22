import { SNAKES_AND_LADDERS, type Player, type GameState } from '../types/game'

export function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1
}

export function getPositionCoordinates(position: number): { row: number; col: number } {
  if (position === 0) return { row: 9, col: 0 }
  
  const adjustedPosition = position - 1
  const row = 9 - Math.floor(adjustedPosition / 10)
  let col = adjustedPosition % 10
  
  // Snake pattern - odd rows go right to left
  if ((9 - row) % 2 === 1) {
    col = 9 - col
  }
  
  return { row, col }
}

export function movePlayer(player: Player, diceRoll: number): Player {
  let newPosition = player.position + diceRoll
  
  // Can't go beyond 100
  if (newPosition > 100) {
    return player
  }
  
  // Check for snakes and ladders
  const snakeOrLadder = SNAKES_AND_LADDERS.find(sl => sl.start === newPosition)
  if (snakeOrLadder) {
    newPosition = snakeOrLadder.end
  }
  
  return {
    ...player,
    position: newPosition
  }
}

export function checkWinner(players: Player[]): string | null {
  const winner = players.find(player => player.position === 100)
  return winner ? winner.id : null
}

export function getNextPlayerIndex(currentIndex: number, totalPlayers: number): number {
  return (currentIndex + 1) % totalPlayers
}

export function createInitialGameState(roomId: string): GameState {
  return {
    id: roomId,
    players: [],
    currentPlayerIndex: 0,
    gameStatus: 'waiting',
    boardSize: 100
  }
}