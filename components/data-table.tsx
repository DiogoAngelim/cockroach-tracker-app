"use client"

import { useState, useMemo } from "react"
import { useRoachData } from "@/lib/roach-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Trash2, TableIcon, Filter } from "lucide-react"

type SortField = "date" | "trapId" | "count"
type SortDirection = "asc" | "desc"

export function DataTable() {
  const { entries, trapLocations, deleteEntry } = useRoachData()
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [filterTrap, setFilterTrap] = useState<string>("all")
  const [filterDateStart, setFilterDateStart] = useState("")
  const [filterDateEnd, setFilterDateEnd] = useState("")

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = [...entries]

    // Filter by trap
    if (filterTrap !== "all") {
      filtered = filtered.filter((e) => e.trapId === filterTrap)
    }

    // Filter by date range
    if (filterDateStart) {
      filtered = filtered.filter((e) => e.date >= filterDateStart)
    }
    if (filterDateEnd) {
      filtered = filtered.filter((e) => e.date <= filterDateEnd)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      if (sortField === "date") {
        comparison = a.date.localeCompare(b.date)
      } else if (sortField === "trapId") {
        comparison = a.trapId.localeCompare(b.trapId)
      } else if (sortField === "count") {
        comparison = a.count - b.count
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [entries, sortField, sortDirection, filterTrap, filterDateStart, filterDateEnd])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Returns a background color class for count: 1 (light red) to 4+ (dark red)
  const getCountBgClass = (count: number) => {
    if (count >= 10) return "bg-purple-950 text-yellow-200" // 4: most aggressive
    if (count >= 5) return "bg-purple-800 text-yellow-100"  // 3: very strong
    if (count >= 2) return "bg-purple-600 text-yellow-50"   // 2: strong
    if (count >= 1) return "bg-purple-400 text-purple-950"  // 1: vivid
    return "bg-white text-gray-500 border border-gray-200"
  }

  const uniqueTraps = [...new Set(entries.map((e) => e.trapId))]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <TableIcon className="h-5 w-5 text-primary" />
          Trap Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-nowrap items-center gap-2 rounded-lg bg-muted/30 p-3">
          <Select value={filterTrap} onValueChange={setFilterTrap}>
            <SelectTrigger className="min-w-0 w-auto max-w-xs bg-input border-border relative overflow-hidden">
              <span className="block truncate pr-6">
                <SelectValue placeholder="All Traps" />
              </span>
              {/* Fade effect on the right if text overflows */}
              <span className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-card via-card/80 to-transparent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Traps</SelectItem>
              {uniqueTraps.map((trap) => (
                <SelectItem key={trap} value={trap}>
                  {trap}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-0 w-auto max-w-xs justify-start text-left font-normal bg-input border border-border rounded-md text-foreground transition-colors hover:bg-muted hover:text-white focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:text-white"
              >
                {filterDateStart ? format(new Date(filterDateStart), "yyyy.MM.dd") : <span>Start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border border-border rounded-md text-foreground shadow-lg" align="start">
              <div className="rounded-md bg-card border border-border p-2">
                <Calendar
                  mode="single"
                  selected={filterDateStart ? new Date(filterDateStart) : undefined}
                  onSelect={(d) => {
                    if (d) setFilterDateStart(format(d, "yyyy.MM.dd"))
                  }}
                  initialFocus
                />
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-0 w-auto max-w-xs justify-start text-left font-normal bg-input border border-border rounded-md text-foreground transition-colors hover:bg-muted hover:text-white focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:text-white"
              >
                {filterDateEnd ? format(new Date(filterDateEnd), "yyyy.MM.dd") : <span>End date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border border-border rounded-md text-foreground shadow-lg" align="start">
              <div className="rounded-md bg-card border border-border p-2">
                <Calendar
                  mode="single"
                  selected={filterDateEnd ? new Date(filterDateEnd) : undefined}
                  onSelect={(d) => {
                    if (d) setFilterDateEnd(format(d, "yyyy.MM.dd"))
                  }}
                  initialFocus
                />
              </div>
            </PopoverContent>
          </Popover>
          {(filterTrap !== "all" || filterDateStart || filterDateEnd) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterTrap("all")
                setFilterDateStart("")
                setFilterDateEnd("")
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50 border-border">
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("date")}
                    className="h-auto p-0 font-semibold hover:bg-transparent hover:text-white"
                  >
                    Date
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("trapId")}
                    className="h-auto p-0 font-semibold hover:bg-transparent hover:text-white"
                  >
                    Trap / Location
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("count")}
                    className="h-auto p-0 font-semibold hover:bg-transparent hover:text-white"
                  >
                    Eliminated
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🪳</span>
                      <span className="text-muted-foreground text-lg font-medium">No entries yet</span>
                      <span className="text-muted-foreground text-sm">Add your first entry to see data here.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/30 border-border">
                    <TableCell className="font-mono text-sm">{entry.date}</TableCell>
                    <TableCell>{entry.trapId}</TableCell>
                    <TableCell>
                      <Badge className={getCountBgClass(entry.count)}>
                        {entry.count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          {entries.length === 0
            ? "No data available. Add entries to see stats."
            : `Showing ${filteredAndSortedEntries.length} of ${entries.length} entries`}
        </div>
      </CardContent>
    </Card>
  )
}
