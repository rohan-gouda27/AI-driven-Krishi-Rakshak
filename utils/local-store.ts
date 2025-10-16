export type EffectivenessLog = {
  id: string
  ts: number
  crop: string
  pest: string
  treatmentType: "natural" | "chemical"
  yieldKg: number
  cost: number
  pestReductionPct: number
  soilHealthScore: number // 1-10
  pollinatorImpact: number // -1,0,1
  recurrenceDays: number
}

const KEY = "krishi.logs.v1"

export function getLogs(): EffectivenessLog[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as EffectivenessLog[]
  } catch {
    return []
  }
}

export function saveLog(entry: EffectivenessLog) {
  if (typeof window === "undefined") return
  const all = getLogs()
  const next = [entry, ...all]
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function updateLog(id: string, patch: Partial<EffectivenessLog>) {
  if (typeof window === "undefined") return
  const all = getLogs()
  const next = all.map((l) => (l.id === id ? { ...l, ...patch } : l))
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function removeLog(id: string) {
  if (typeof window === "undefined") return
  const all = getLogs().filter((l) => l.id !== id)
  localStorage.setItem(KEY, JSON.stringify(all))
}
