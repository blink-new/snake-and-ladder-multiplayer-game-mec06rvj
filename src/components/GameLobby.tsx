import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Users, Plus, LogIn } from 'lucide-react'

interface GameLobbyProps {
  onCreateRoom: (playerName: string) => void
  onJoinRoom: (roomCode: string, playerName: string) => void
  isLoading: boolean
}

export function GameLobby({ onCreateRoom, onJoinRoom, isLoading }: GameLobbyProps) {
  const [playerName, setPlayerName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [mode, setMode] = useState<'create' | 'join'>('create')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return

    if (mode === 'create') {
      onCreateRoom(playerName.trim())
    } else {
      if (!roomCode.trim()) return
      onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🐍</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Snake & Ladder
          </h1>
          <p className="text-slate-600">
            Play the classic board game with friends online!
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === 'create' ? 'default' : 'outline'}
            onClick={() => setMode('create')}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Room
          </Button>
          <Button
            variant={mode === 'join' ? 'default' : 'outline'}
            onClick={() => setMode('join')}
            className="flex-1"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Join Room
          </Button>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {mode === 'create' ? <Plus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              {mode === 'create' ? 'Create New Room' : 'Join Existing Room'}
            </CardTitle>
            <CardDescription>
              {mode === 'create' 
                ? 'Start a new game and invite your friends'
                : 'Enter the room code shared by your friend'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name
                </label>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  maxLength={20}
                />
              </div>

              {mode === 'join' && (
                <div>
                  <label htmlFor="roomCode" className="block text-sm font-medium text-slate-700 mb-2">
                    Room Code
                  </label>
                  <Input
                    id="roomCode"
                    type="text"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    required
                    maxLength={6}
                    className="uppercase"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isLoading || !playerName.trim() || (mode === 'join' && !roomCode.trim())}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === 'create' ? 'Creating...' : 'Joining...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {mode === 'create' ? <Plus className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    {mode === 'create' ? 'Create Room' : 'Join Room'}
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center text-sm text-slate-600">
          <p className="mb-2">✨ Features:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span>🎮 Real-time multiplayer</span>
            <span>🎲 Animated dice</span>
            <span>📱 Mobile friendly</span>
          </div>
        </div>
      </div>
    </div>
  )
}