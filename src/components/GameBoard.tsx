import React from 'react'
import { SNAKES_AND_LADDERS, type Player } from '../types/game'
import { getPositionCoordinates } from '../utils/gameLogic'

interface GameBoardProps {
  players: Player[]
}

export function GameBoard({ players }: GameBoardProps) {
  const renderCell = (position: number) => {
    const { row, col } = getPositionCoordinates(position)
    const snakeOrLadder = SNAKES_AND_LADDERS.find(sl => sl.start === position || sl.end === position)
    const playersOnCell = players.filter(player => player.position === position)
    
    return (
      <div
        key={position}
        className={`
          relative aspect-square border border-slate-300 flex items-center justify-center text-xs font-medium
          ${position === 1 ? 'bg-green-100' : position === 100 ? 'bg-yellow-100' : 'bg-white'}
          ${snakeOrLadder?.start === position && snakeOrLadder.type === 'snake' ? 'bg-red-50' : ''}
          ${snakeOrLadder?.start === position && snakeOrLadder.type === 'ladder' ? 'bg-blue-50' : ''}
        `}
        style={{
          gridRow: row + 1,
          gridColumn: col + 1
        }}
      >
        {/* Cell number */}
        <span className="absolute top-1 left-1 text-slate-500 text-[10px]">
          {position}
        </span>
        
        {/* Snake or Ladder indicator */}
        {snakeOrLadder?.start === position && (
          <div className={`absolute inset-0 flex items-center justify-center text-lg`}>
            {snakeOrLadder.type === 'snake' ? '🐍' : '🪜'}
          </div>
        )}
        
        {/* Players on this cell */}
        {playersOnCell.length > 0 && (
          <div className="absolute bottom-1 right-1 flex flex-wrap gap-0.5">
            {playersOnCell.map((player, index) => (
              <div
                key={player.id}
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: player.color }}
                title={player.name}
              />
            ))}
          </div>
        )}
        
        {/* Special cell markers */}
        {position === 1 && (
          <span className="absolute bottom-1 left-1 text-green-600 text-xs font-bold">START</span>
        )}
        {position === 100 && (
          <span className="absolute bottom-1 left-1 text-yellow-600 text-xs font-bold">FINISH</span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="grid grid-cols-10 gap-0 border-2 border-slate-400 rounded-lg overflow-hidden">
        {Array.from({ length: 100 }, (_, i) => renderCell(100 - i))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>🐍</span>
          <span>Snake</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🪜</span>
          <span>Ladder</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-slate-300 rounded"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-100 border border-slate-300 rounded"></div>
          <span>Finish</span>
        </div>
      </div>
    </div>
  )
}