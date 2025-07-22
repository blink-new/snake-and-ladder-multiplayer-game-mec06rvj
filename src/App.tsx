import React, { useState, useEffect } from 'react'
import { GameLobby } from './components/GameLobby'
import { Game } from './components/Game'
import { blink } from './blink/client'
import { generateRoomCode } from './utils/gameLogic'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [gameState, setGameState] = useState<{
    inGame: boolean
    roomCode: string
    playerName: string
  }>({
    inGame: false,
    roomCode: '',
    playerName: ''
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setCurrentUser(state.user)
      setIsLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleCreateRoom = async (playerName: string) => {
    const roomCode = generateRoomCode()
    setGameState({
      inGame: true,
      roomCode,
      playerName
    })
  }

  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    setGameState({
      inGame: true,
      roomCode,
      playerName
    })
  }

  const handleLeaveRoom = () => {
    setGameState({
      inGame: false,
      roomCode: '',
      playerName: ''
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🐍</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Snake & Ladder
          </h1>
          <p className="text-slate-600 mb-6">
            Please sign in to play the multiplayer game
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In to Play
          </button>
        </div>
      </div>
    )
  }

  if (gameState.inGame) {
    return (
      <Game
        roomCode={gameState.roomCode}
        playerName={gameState.playerName}
        onLeaveRoom={handleLeaveRoom}
      />
    )
  }

  return (
    <GameLobby
      onCreateRoom={handleCreateRoom}
      onJoinRoom={handleJoinRoom}
      isLoading={false}
    />
  )
}

export default App