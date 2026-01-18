"use client"

import { useMemo, useState } from "react"
import { useRoachData } from "@/lib/roach-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, BarChart3 } from "lucide-react"


const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const CHART_HEIGHT = 340;

export function ChartsSection() {
  const { entries } = useRoachData()
  const [dateRangeStart, setDateRangeStart] = useState("")
  const [dateRangeEnd, setDateRangeEnd] = useState("")

  const filteredEntries = useMemo(() => {
    let filtered = [...entries]
    if (dateRangeStart) {
      filtered = filtered.filter((e) => e.date >= dateRangeStart)
    }
    if (dateRangeEnd) {
      filtered = filtered.filter((e) => e.date <= dateRangeEnd)
    }
    return filtered
  }, [entries, dateRangeStart, dateRangeEnd])

  // Get all unique traps
  const uniqueTraps = useMemo(() => {
    return [...new Set(filteredEntries.map((e) => e.trapId))]
  }, [filteredEntries])

  // Prepare line chart data (daily counts per trap)
  const lineChartData = useMemo(() => {
    const dateMap: Record<string, Record<string, number>> = {}

    filteredEntries.forEach((entry) => {
      if (!dateMap[entry.date]) {
        dateMap[entry.date] = {}
      }
      dateMap[entry.date][entry.trapId] = (dateMap[entry.date][entry.trapId] || 0) + entry.count
    })

    return Object.entries(dateMap)
      .map(([date, traps]) => ({
        date,
        ...traps,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredEntries])

  // Prepare bar chart data (total per trap)
  const barChartData = useMemo(() => {
    const trapTotals: Record<string, number> = {}

    filteredEntries.forEach((entry) => {
      trapTotals[entry.trapId] = (trapTotals[entry.trapId] || 0) + entry.count
    })

    return Object.entries(trapTotals)
      .map(([trap, total]) => ({
        trap,
        total,
      }))
      .sort((a, b) => b.total - a.total)
  }, [filteredEntries])

  // Calculate stats
  const totalCaught = filteredEntries.reduce((sum, e) => sum + e.count, 0)
  const highestTrap = barChartData[0]
  const averageDaily = lineChartData.length > 0
    ? Math.round(totalCaught / lineChartData.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card className="border-border bg-card">
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <Label className="text-muted-foreground">Date range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-0 w-auto max-w-xs justify-start text-left font-normal bg-input border border-border rounded-md text-foreground transition-colors hover:bg-muted hover:text-white focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {dateRangeStart ? format(new Date(dateRangeStart), "yyyy.MM.dd") : <span>Start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border border-border rounded-md text-foreground shadow-lg" align="start">
                <div className="rounded-md bg-card border border-border p-2">
                  <Calendar
                    mode="single"
                    selected={dateRangeStart ? new Date(dateRangeStart) : undefined}
                    onSelect={(d) => {
                      if (d) setDateRangeStart(format(d, "yyyy.MM.dd"))
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
                  className="min-w-0 w-auto max-w-xs justify-start text-left font-normal bg-input border border-border rounded-md text-foreground transition-colors hover:bg-muted hover:text-white focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {dateRangeEnd ? format(new Date(dateRangeEnd), "yyyy.MM.dd") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border border-border rounded-md text-foreground shadow-lg" align="start">
                <div className="rounded-md bg-card border border-border p-2">
                  <Calendar
                    mode="single"
                    selected={dateRangeEnd ? new Date(dateRangeEnd) : undefined}
                    onSelect={(d) => {
                      if (d) setDateRangeEnd(format(d, "yyyy.MM.dd"))
                    }}
                    initialFocus
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Charts Sub-Tabs */}
      <Tabs defaultValue="stats">
        <TabsList className="mb-4">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {filteredEntries.length === 0 ? (
              <Card className="border-border bg-card col-span-3">
                <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center gap-2">
                  <span className="text-muted-foreground text-lg font-medium">No stats to show</span>
                  <span className="text-muted-foreground text-sm">Add entries to see statistics here.</span>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border-border bg-card">
                  <CardContent className="pt-4">
                    <div className="text-muted-foreground text-sm">Total collected</div>
                    <div className="text-3xl font-bold text-primary">{totalCaught}</div>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card">
                  <CardContent className="pt-4">
                    <div className="text-muted-foreground text-sm">Room for improvement</div>
                    <div className="text-xl font-bold text-accent flex items-center gap-2">
                      {highestTrap ? (
                        <>
                          {highestTrap.trap}
                          <Badge variant="secondary">{highestTrap.total}</Badge>
                        </>
                      ) : "—"}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card">
                  <CardContent className="pt-4">
                    <div className="text-muted-foreground text-sm">Daily average</div>
                    <div className="text-3xl font-bold">{averageDaily}</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="line">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-5 w-5 text-primary" />
                Daily Trends by Trap
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lineChartData.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  No data to display
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                  <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="date"
                      stroke="var(--muted-foreground)"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Legend />
                    {uniqueTraps.map((trap, index) => (
                      <Line
                        key={trap}
                        type="monotone"
                        dataKey={trap}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bar">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-5 w-5 text-accent" />
                Total by Trap Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {barChartData.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  No data to display
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                  <BarChart data={barChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="trap"
                      stroke="var(--muted-foreground)"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill="var(--chart-2)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
