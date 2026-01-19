"use client"

import { RoachProvider } from "@/lib/roach-context"
import { EntryForm } from "@/components/entry-form"
import { DataTable } from "@/components/data-table"
import { ChartsSection } from "@/components/charts-section"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bug } from "lucide-react"
import WelcomeScreen from "@/components/welcome-screen"
import { useState } from "react"
// import { WindowControls } from "@/components/window-controls"

function Dashboard() {
  const [tab, setTab] = useState("form");
  return (
    <div className="min-h-screen bg-background">
      {/* <WindowControls /> */}
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Roach Monitor</h1>
              <p className="text-xs text-muted-foreground">Daily Cockroach Tracking</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {(() => {
              const d = new Date();
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              return `${d.toLocaleDateString("en-US", { weekday: "long" })}, ${yyyy}.${mm}.${dd}`;
            })()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="form">Entry Form</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <EntryForm onActionComplete={() => setTab("table")} />
          </TabsContent>
          <TabsContent value="table">
            <DataTable />
          </TabsContent>
          <TabsContent value="charts">
            <ChartsSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function Home() {
  const [started, setStarted] = useState(false);
  return (
    <RoachProvider>
      {!started ? (
        <WelcomeScreen onStart={() => setStarted(true)} />
      ) : (
        <Dashboard />
      )}
    </RoachProvider>
  );
}
