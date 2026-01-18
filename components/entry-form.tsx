"use client"

import React, { useRef } from "react"
import { useState } from "react"
import { useRoachData } from "@/lib/roach-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiTagInput } from "@/components/ui/multi-tag-input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card"

import { Bug, Plus, Minus } from "lucide-react"

export function EntryForm({ onActionComplete }: { onActionComplete?: () => void }) {
  // Instead of a single ref, play a new Audio instance for each click
  const { trapLocations, addEntry, addTrapLocation, removeTrapLocation } = useRoachData()
  const today = new Date().toISOString().split("T")[0]
  const [date, setDate] = useState(today)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [trapTags, setTrapTags] = useState<string[]>([])
  const [counts, setCounts] = useState<{ [trap: string]: string }>({})
  const [newTrap, setNewTrap] = useState("")
  const [showNewTrap, setShowNewTrap] = useState(false)
  // Always use trapLocations as the source of truth
  const trapNames = trapLocations.map(t => t.name)

  // Remove tags that are no longer in trapNames
  React.useEffect(() => {
    setTrapTags(tags => tags.filter(tag => trapNames.includes(tag)))
  }, [trapLocations])

  const getCountValue = (trap: string) => counts[trap] === undefined || counts[trap] === "" ? 0 : parseInt(counts[trap], 10)

  const incrementCount = (trap: string) => {
    setCounts(prev => ({ ...prev, [trap]: String(getCountValue(trap) + 1) }))
    // Play spray sound asynchronously, allowing overlap
    const spray = new Audio('/sounds/spray.mp3');
    // Use Promise.all in case you want to play multiple sounds in the future
    Promise.all([
      spray.play()
    ]).catch(() => {/* ignore play errors */ });
  }

  const decrementCount = async (trap: string) => {
    const value = getCountValue(trap)
    if (value > 0) {
      const broom = new Audio('/sounds/broom.mp3');
      try {
        await broom.play();
      } catch {
        // ignore play errors
      }
      await new Promise(res => setTimeout(res, 400));
      setCounts(prev => ({ ...prev, [trap]: String(value - 1) }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trapTags.length === 0) return
    let added = false;
    trapTags.forEach(trapId => {
      const count = getCountValue(trapId)
      if (count > 0) {
        addEntry({
          date,
          trapId,
          count,
        })
        added = true;
      }
    })
    // Reset form
    setCounts({})
    setTrapTags([])
    if (added && onActionComplete) {
      onActionComplete();
    }
  }

  const handleAddTrap = () => {
    if (newTrap.trim() && !trapNames.includes(newTrap.trim())) {
      addTrapLocation(newTrap.trim())
      setTrapTags(tags => [...tags, newTrap.trim()])
      setNewTrap("")
      setShowNewTrap(false)
    }
  }

  const handleRemoveTrap = (name: string) => {
    removeTrapLocation(name)
  }

  return (
    <>
      {/* No persistent audio element needed, play with new Audio() */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Bug className="h-5 w-5 text-primary" />
            Cockroaches found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


              <div className="space-y-2">
                <Label htmlFor="date" className="text-muted-foreground text-sm">When</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={
                        "w-full justify-start text-left font-normal bg-input border border-border rounded-md text-foreground transition-colors hover:bg-muted hover:text-white focus:ring-2 focus:ring-ring focus:ring-offset-2" +
                        (date ? "" : " text-muted-foreground")
                      }
                    >
                      {date ? format(new Date(date), "yyyy.MM.dd") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border border-border rounded-md text-foreground shadow-lg" align="start">
                    <div className="rounded-md bg-card border border-border p-2">
                      <Calendar
                        mode="single"
                        selected={date ? new Date(date) : undefined}
                        onSelect={(d) => {
                          if (d) {
                            setDate(format(d, "yyyy.MM.dd"))
                            setCalendarOpen(false)
                          }
                        }}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trap" className="text-muted-foreground text-sm">Where did you find it?</Label>
                <MultiTagInput
                  tags={trapTags}
                  onChange={setTrapTags}
                  placeholder={trapNames.length === 0 ? "Add a location and press Enter" : "Select or add locations"}
                  options={trapNames}
                />
                {/* New location input removed as requested */}
              </div>
            </div>

            {trapTags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">How many?</Label>
                <div className="flex flex-wrap gap-3">
                  {trapTags.map(trap => (
                    <div key={trap} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
                      <Input
                        id={`count-${trap}`}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={counts[trap] ?? ""}
                        onChange={e => {
                          const val = e.target.value;
                          setCounts(prev => ({ ...prev, [trap]: val }));
                        }}
                        className="w-16 h-8 bg-input border-border text-center text-base font-semibold tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        disabled={!date}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => decrementCount(trap)}
                        disabled={getCountValue(trap) <= 0 || !date}
                        className="h-8 w-8 shrink-0 rounded-full border-border bg-secondary hover:bg-muted font-bold"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => incrementCount(trap)}
                        disabled={!date}
                        className="h-8 w-8 shrink-0 rounded-full border-border bg-secondary hover:bg-muted font-bold"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium text-destructive">{trap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-bold uppercase"
              disabled={
                trapTags.length === 0 ||
                trapTags.every(trap => !counts[trap] || parseInt(counts[trap] || '0', 10) === 0)
              }
            >
              TAKE ACTION
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
