"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { saveData, getData } from "./local-db"
import type { TrapEntry, TrapLocation } from "./types"

interface RoachContextType {
  entries: TrapEntry[]
  trapLocations: TrapLocation[]
  addEntry: (entry: Omit<TrapEntry, "id">) => void
  addTrapLocation: (name: string) => void
  deleteEntry: (id: string) => void
  removeTrapLocation: (name: string) => void
}

const RoachContext = createContext<RoachContextType | undefined>(undefined)

const defaultTrapLocations: TrapLocation[] = [
  { id: '1', name: 'Kitchen' },
  { id: '2', name: 'Bathroom' },
  { id: '3', name: 'Garage' },
  { id: '4', name: 'Living Room' },
]
const sampleEntries: TrapEntry[] = []

export function RoachProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<TrapEntry[]>([])
  const [trapLocations, setTrapLocations] = useState<TrapLocation[]>(defaultTrapLocations)

  // Load from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const storedEntries = await getData("entries")
      const storedLocations = await getData("trapLocations")
      setEntries(Array.isArray(storedEntries) ? storedEntries : [])
      if (Array.isArray(storedLocations) && storedLocations.length > 0) {
        setTrapLocations(storedLocations)
      } else {
        setTrapLocations(defaultTrapLocations)
      }
    })()
  }, [])

  // Save entries to IndexedDB when changed
  useEffect(() => {
    if (entries.length > 0) saveData("entries", entries)
  }, [entries])

  // Save trapLocations to IndexedDB when changed
  useEffect(() => {
    if (trapLocations.length > 0) saveData("trapLocations", trapLocations)
  }, [trapLocations])

  const addEntry = (entry: Omit<TrapEntry, "id">) => {
    const newEntry: TrapEntry = {
      ...entry,
      id: Date.now().toString(),
    }
    setEntries((prev) => [newEntry, ...prev])
  }

  const addTrapLocation = (name: string) => {
    const newLocation: TrapLocation = {
      id: Date.now().toString(),
      name,
    }
    setTrapLocations((prev) => [...prev, newLocation])
  }

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const removeTrapLocation = (name: string) => {
    setTrapLocations((prev) => {
      const updated = prev.filter((t) => t.name !== name)
      saveData("trapLocations", updated)
      return updated
    })
  }

  return (
    <RoachContext.Provider value={{ entries, trapLocations, addEntry, addTrapLocation, deleteEntry, removeTrapLocation }}>
      {children}
    </RoachContext.Provider>
  )
}

export function useRoachData() {
  const context = useContext(RoachContext)
  if (context === undefined) {
    throw new Error("useRoachData must be used within a RoachProvider")
  }
  return context
}
