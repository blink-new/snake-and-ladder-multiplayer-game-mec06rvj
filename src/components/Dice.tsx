import React, { useState } from 'react'
import { Button } from './ui/button'

interface DiceProps {
  onRoll: (value: number) => void
  disabled: boolean
  lastRoll?: number
}

export function Dice({ onRoll, disabled, lastRoll }: DiceProps) {
  const [isRolling, setIsRolling] = useState(false)

  const handleRoll = async () => {
    if (disabled || isRolling) return
    
    setIsRolling(true)
    
    // Simulate rolling animation
    const rollDuration = 1000
    const rollInterval = 100
    let currentRoll = 1
    
    const rollAnimation = setInterval(() => {
      currentRoll = Math.floor(Math.random() * 6) + 1
    }, rollInterval)
    
    setTimeout(() => {
      clearInterval(rollAnimation)
      const finalRoll = Math.floor(Math.random() * 6) + 1
      setIsRolling(false)
      onRoll(finalRoll)
    }, rollDuration)
  }

  const getDiceFace = (value: number) => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
    return faces[value - 1] || '⚀'
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`
          w-20 h-20 bg-white border-2 border-slate-300 rounded-lg shadow-lg
          flex items-center justify-center text-4xl transition-transform duration-100
          ${isRolling ? 'animate-bounce' : ''}
        `}
      >
        {isRolling ? getDiceFace(Math.floor(Math.random() * 6) + 1) : getDiceFace(lastRoll || 1)}
      </div>
      
      <Button
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </Button>
      
      {lastRoll && !isRolling && (
        <p className="text-sm text-slate-600">
          Last roll: <span className="font-bold text-indigo-600">{lastRoll}</span>
        </p>
      )}
    </div>
  )
}