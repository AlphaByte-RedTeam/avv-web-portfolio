'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type PreferencesContextType = {
  soundEnabled: boolean
  toggleSound: () => void
  playClickSound: () => void
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    const savedSound = localStorage.getItem('soundEnabled')
    if (savedSound !== null) setSoundEnabled(JSON.parse(savedSound))
  }, [])

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const newVal = !prev
      localStorage.setItem('soundEnabled', JSON.stringify(newVal))
      return newVal
    })
  }

  const playClickSound = () => {
    if (!soundEnabled) return
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1)
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  }

  return (
    <PreferencesContext.Provider value={{ soundEnabled, toggleSound, playClickSound }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}