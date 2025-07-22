import React from 'react'
import { Crown, User } from 'lucide-react'
import { type Player } from '../types/game'

interface PlayerListProps {
  players: Player[]
  currentPlayerIndex: number
  winner?: string
}

export function PlayerList({ players, currentPlayerIndex, winner }: PlayerListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Players ({players.length})
      </h3>
      
      <div className="space-y-3">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg border-2 transition-all
              ${index === currentPlayerIndex && !winner ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}
              ${winner === player.id ? 'border-yellow-500 bg-yellow-50' : ''}
            `}
          >
            {/* Player color indicator */}
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: player.color }}
            />
            
            {/* Player info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800">{player.name}</span>
                {winner === player.id && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
                {index === currentPlayerIndex && !winner && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    Your turn
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-500">
                Position: {player.position}/100
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-16">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${player.position}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 text-center mt-1">
                {player.position}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {players.length === 0 && (
        <div className="text-center text-slate-500 py-8">
          <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No players yet</p>
          <p className="text-sm">Share the room code to invite friends!</p>
        </div>
      )}
    </div>
  )
}