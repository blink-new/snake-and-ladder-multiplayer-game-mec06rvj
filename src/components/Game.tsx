import React, { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { GameBoard } from './GameBoard'
import { Dice } from './Dice'
import { PlayerList } from './PlayerList'
import { Copy, Users, Trophy, ArrowLeft } from 'lucide-react'
import { blink } from '../blink/client'
import { type GameState, type Player, PLAYER_COLORS } from '../types/game'
import { rollDice, movePlayer, checkWinner, getNextPlayerIndex } from '../utils/gameLogic'

interface GameProps {
  roomCode: string
  playerName: string
  onLeaveRoom: () => void
}

export function Game({ roomCode, playerName, onLeaveRoom }: GameProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isMyTurn, setIsMyTurn] = useState(false)
  const [showWinner, setShowWinner] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const unsubscribe = blink.auth.onAuthStateChanged((state) => {
        setCurrentUser(state.user)
      })
      return unsubscribe
    }
    
    initAuth()
  }, [])

  const getGameState = useCallback(async (): Promise<GameState | null> => {
    try {
      const games = await blink.db.games.list({
        where: { roomCode: roomCode },
        limit: 1
      })
      if (games[0]?.gameState) {
        // Parse JSON string back to object
        return typeof games[0].gameState === 'string' 
          ? JSON.parse(games[0].gameState) 
          : games[0].gameState
      }
      return null
    } catch (error) {
      console.error('Failed to get game state:', error)
      return null
    }
  }, [roomCode])

  const updateGameState = useCallback(async (newGameState: GameState) => {
    try {
      // Save to database with proper field names
      await blink.db.games.upsert({
        id: roomCode,
        roomCode: roomCode,
        gameState: JSON.stringify(newGameState), // Serialize as JSON string
        updatedAt: new Date().toISOString()
      })

      // Broadcast to all players
      await blink.realtime.publish(`game-${roomCode}`, 'game-state-update', newGameState)
    } catch (error) {
      console.error('Failed to update game state:', error)
    }
  }, [roomCode])

  const initializeGame = useCallback(async () => {
    if (!currentUser) return

    try {
      // Check if player already exists in game
      const existingGameState = await getGameState()
      
      if (existingGameState) {
        const existingPlayer = existingGameState.players.find(p => p.id === currentUser.id)
        
        if (!existingPlayer) {
          // Add new player
          const newPlayer: Player = {
            id: currentUser.id,
            name: playerName,
            color: PLAYER_COLORS[existingGameState.players.length % PLAYER_COLORS.length],
            position: 0,
            isReady: true
          }
          
          const updatedGameState = {
            ...existingGameState,
            players: [...existingGameState.players, newPlayer]
          }
          
          await updateGameState(updatedGameState)
        }
      } else {
        // Create new game
        const initialGameState: GameState = {
          id: roomCode,
          players: [{
            id: currentUser.id,
            name: playerName,
            color: PLAYER_COLORS[0],
            position: 0,
            isReady: true
          }],
          currentPlayerIndex: 0,
          gameStatus: 'waiting',
          boardSize: 100
        }
        
        await updateGameState(initialGameState)
      }
    } catch (error) {
      console.error('Failed to initialize game:', error)
    }
  }, [currentUser, playerName, roomCode, getGameState, updateGameState])

  useEffect(() => {
    if (!currentUser) return

    // Subscribe to game updates
    const unsubscribe = blink.realtime.subscribe(`game-${roomCode}`, (message) => {
      if (message.type === 'game-state-update') {
        const newGameState = message.data as GameState
        setGameState(newGameState)
        
        // Check if it's current user's turn
        const currentPlayer = newGameState.players[newGameState.currentPlayerIndex]
        setIsMyTurn(currentPlayer?.id === currentUser.id)
        
        // Check for winner
        if (newGameState.winner && !showWinner) {
          setShowWinner(true)
        }
      }
    })

    // Initialize or join game
    initializeGame()

    return () => {
      unsubscribe()
    }
  }, [currentUser, roomCode, showWinner, playerName, initializeGame])

  const handleDiceRoll = async (diceValue: number) => {
    if (!gameState || !isMyTurn || gameState.gameStatus !== 'playing') return

    const currentPlayer = gameState.players[gameState.currentPlayerIndex]
    const updatedPlayer = movePlayer(currentPlayer, diceValue)
    
    const updatedPlayers = gameState.players.map(p => 
      p.id === currentPlayer.id ? updatedPlayer : p
    )

    const winner = checkWinner(updatedPlayers)
    const nextPlayerIndex = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.players.length)

    const updatedGameState: GameState = {
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: winner ? gameState.currentPlayerIndex : nextPlayerIndex,
      gameStatus: winner ? 'finished' : 'playing',
      winner: winner || undefined,
      lastDiceRoll: diceValue
    }

    await updateGameState(updatedGameState)
  }

  const startGame = async () => {
    if (!gameState || gameState.players.length < 2) return

    const updatedGameState: GameState = {
      ...gameState,
      gameStatus: 'playing'
    }

    await updateGameState(updatedGameState)
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onLeaveRoom}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Leave
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Snake & Ladder</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Room: {roomCode}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyRoomCode}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {gameState.gameStatus === 'waiting' && gameState.players.length >= 2 && (
            <Button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Game
            </Button>
          )}
        </div>

        {/* Game Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <GameBoard players={gameState.players} />
            
            {/* Game Controls */}
            {gameState.gameStatus === 'playing' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-center">
                    {isMyTurn ? "Your Turn!" : `${gameState.players[gameState.currentPlayerIndex]?.name}'s Turn`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Dice
                    onRoll={handleDiceRoll}
                    disabled={!isMyTurn}
                    lastRoll={gameState.lastDiceRoll}
                  />
                </CardContent>
              </Card>
            )}

            {gameState.gameStatus === 'waiting' && (
              <Card className="mt-6">
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Waiting for Players
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Share the room code <strong>{roomCode}</strong> with your friends!
                  </p>
                  <p className="text-sm text-slate-500">
                    Need at least 2 players to start the game.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PlayerList
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
              winner={gameState.winner}
            />
          </div>
        </div>

        {/* Winner Modal */}
        {showWinner && gameState.winner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader className="text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">🎉 Game Over! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg mb-4">
                  <strong>{gameState.players.find(p => p.id === gameState.winner)?.name}</strong> wins!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setShowWinner(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={onLeaveRoom}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    New Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}