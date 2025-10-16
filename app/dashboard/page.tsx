"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useMemo, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

type LogEntry = {
  date: string
  crop: string
  pest: string
  methodType: "Natural" | "Chemical"
  costInput: number
  laborHours: number
  yieldBefore: number
  yieldAfter: number
  pestCountBefore: number
  pestCountAfter: number
  soilHealthScore: number // 0-100 (approx from field tests)
  pollinatorCount: number
  recurrenceWithin60Days: boolean
}

const key = "krishi_logs"

function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  useEffect(() => {
    setLogs(JSON.parse(localStorage.getItem(key) || "[]"))
  }, [])
  const save = (l: LogEntry) => {
    const next = [...logs, l]
    setLogs(next)
    localStorage.setItem(key, JSON.stringify(next))
  }
  return { logs, save }
}

export default function DashboardPage() {
  const { logs, save } = useLogs()

  const agg = useMemo(() => {
    const by = { Natural: [] as LogEntry[], Chemical: [] as LogEntry[] }
    for (const l of logs) by[l.methodType].push(l)

    const calc = (arr: LogEntry[]) => {
      const n = arr.length || 1
      const avg = (sum: number) => sum / n
      return {
        yieldImpact: avg(arr.reduce((s, a) => s + (a.yieldAfter - a.yieldBefore), 0)), // absolute diff
        pestReduction: avg(arr.reduce((s, a) => s + (a.pestCountBefore - a.pestCountAfter), 0)),
        soilHealth: avg(arr.reduce((s, a) => s + a.soilHealthScore, 0)),
        cost: avg(arr.reduce((s, a) => s + (a.costInput + a.laborHours * 1), 0)), // labor weight 1 unit/hr
        envImpact: avg(arr.reduce((s, a) => s + a.pollinatorCount, 0)), // higher is better
        recurrence: avg(arr.reduce((s, a) => s + (a.recurrenceWithin60Days ? 1 : 0), 0)) * 100, // %
      }
    }

    return { Natural: calc(by.Natural), Chemical: calc(by.Chemical) }
  }, [logs])

  const chartData = [
    { metric: "Yield Δ", Natural: agg.Natural.yieldImpact, Chemical: agg.Chemical.yieldImpact },
    { metric: "Pest Red.", Natural: agg.Natural.pestReduction, Chemical: agg.Chemical.pestReduction },
    { metric: "Soil Health", Natural: agg.Natural.soilHealth, Chemical: agg.Chemical.soilHealth },
    { metric: "Cost (↓better)", Natural: agg.Natural.cost, Chemical: agg.Chemical.cost },
    { metric: "Pollinators", Natural: agg.Natural.envImpact, Chemical: agg.Chemical.envImpact },
    { metric: "Recurrence %", Natural: agg.Natural.recurrence, Chemical: agg.Chemical.recurrence },
  ]

  const [form, setForm] = useState<LogEntry>({
    date: new Date().toISOString().slice(0, 10),
    crop: "Rice",
    pest: "",
    methodType: "Natural",
    costInput: 0,
    laborHours: 0,
    yieldBefore: 0,
    yieldAfter: 0,
    pestCountBefore: 0,
    pestCountAfter: 0,
    soilHealthScore: 0,
    pollinatorCount: 0,
    recurrenceWithin60Days: false,
  })

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Effectiveness Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Compare natural vs chemical methods across yield impact, pest reduction, soil health, cost, environmental
        impact, and recurrence.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Field Log</CardTitle>
            <CardDescription>Store locally for quick pilots; export by copying JSON later.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Date</Label>
                <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Crop</Label>
                <Input value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Pest</Label>
                <Input value={form.pest} onChange={(e) => setForm({ ...form, pest: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Method (Natural/Chemical)</Label>
                <Input
                  value={form.methodType}
                  onChange={(e) =>
                    setForm({ ...form, methodType: e.target.value === "Chemical" ? "Chemical" : "Natural" })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Cost Inputs</Label>
                <Input
                  type="number"
                  value={form.costInput}
                  onChange={(e) => setForm({ ...form, costInput: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-xs">Labor Hours</Label>
                <Input
                  type="number"
                  value={form.laborHours}
                  onChange={(e) => setForm({ ...form, laborHours: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-xs">Soil Health (0-100)</Label>
                <Input
                  type="number"
                  value={form.soilHealthScore}
                  onChange={(e) => setForm({ ...form, soilHealthScore: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Yield Before</Label>
                <Input
                  type="number"
                  value={form.yieldBefore}
                  onChange={(e) => setForm({ ...form, yieldBefore: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-xs">Yield After</Label>
                <Input
                  type="number"
                  value={form.yieldAfter}
                  onChange={(e) => setForm({ ...form, yieldAfter: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-xs">Pollinator Count</Label>
                <Input
                  type="number"
                  value={form.pollinatorCount}
                  onChange={(e) => setForm({ ...form, pollinatorCount: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Pest Count Before</Label>
                <Input
                  type="number"
                  value={form.pestCountBefore}
                  onChange={(e) => setForm({ ...form, pestCountBefore: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-xs">Pest Count After</Label>
                <Input
                  type="number"
                  value={form.pestCountAfter}
                  onChange={(e) => setForm({ ...form, pestCountAfter: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-xs">Recurrence in 60 days (0/1)</Label>
                <Input
                  type="number"
                  value={form.recurrenceWithin60Days ? 1 : 0}
                  onChange={(e) => setForm({ ...form, recurrenceWithin60Days: Number(e.target.value) === 1 })}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                save(form)
                toast({ title: "Saved", description: "Log stored locally" })
              }}
            >
              Save Log
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
            <CardDescription>Aggregated metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="metric" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Bar dataKey="Natural" fill="var(--color-primary)" />
                <Bar dataKey="Chemical" fill="var(--color-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How we evaluate</CardTitle>
          <CardDescription>
            Yield impact, pest reduction, soil health, cost, environmental impact, recurrence.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Enter logs from farmer expense books, trap counts, soil test summaries, and harvest weights. The dashboard
          computes deltas and averages for both methods to build confidence in natural farming with measurable outcomes.
        </CardContent>
      </Card>
    </main>
  )
}
