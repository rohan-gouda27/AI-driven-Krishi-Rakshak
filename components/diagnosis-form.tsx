"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { knowledgeBase, matchPests, type NaturalStep } from "@/data/pest-knowledge"
import { toast } from "@/components/ui/use-toast"

type Result = {
  topMatches: Array<{ pest: string; score: number; crop: string }>
  steps: NaturalStep[]
  aiNotes?: string
}

const fetcher = (url: string, opts?: RequestInit) =>
  fetch(url, opts).then((r) => {
    if (!r.ok) throw new Error("Request failed")
    return r.json()
  })

export function DiagnosisForm() {
  const [crop, setCrop] = useState("Rice")
  const [stage, setStage] = useState("Vegetative")
  const [symptoms, setSymptoms] = useState("")
  const [weather, setWeather] = useState("")
  const [soil, setSoil] = useState("")
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const [lang, setLang] = useState("en-IN")
  const [translated, setTranslated] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const kb = knowledgeBase

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setPhoto(String(reader.result))
    reader.readAsDataURL(file)
  }

  const [result, setResult] = useState<Result | null>(null)

  const onSubmit = async () => {
    try {
      setBusy(true)
      const matches = matchPests({ crop, stage, symptoms, weather, soil })
      const steps = matches.length > 0 ? kb[matches[0].crop].pests[matches[0].pest].natural : []

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, stage, symptoms, weather, soil, photo }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        console.log("[v0] /api/diagnose error status:", res.status, text)
        throw new Error(`Diagnose API failed (${res.status})`)
      }
      const data = await res.json().catch(() => ({}))

      setResult({
        topMatches: matches.slice(0, 3),
        steps,
        aiNotes: data?.aiNotes,
      })
      toast({ title: "Diagnosis complete", description: "Review natural steps and guidance." })
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to diagnose", variant: "destructive" })
    } finally {
      setBusy(false)
    }
  }

  const guidanceText = useMemo(() => {
    if (!result) return ""
    const lines = result.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.detail} (${s.timing})`)
    return [
      `Crop: ${crop}. Stage: ${stage}.`,
      `Recommended natural treatment steps:`,
      ...lines,
      result.aiNotes ? `Notes: ${result.aiNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  }, [result, crop, stage])

  const speak = () => {
    if (!guidanceText) return
    const u = new SpeechSynthesisUtterance(guidanceText)
    u.lang = lang
    u.rate = 1
    u.pitch = 1
    u.volume = 1
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
  }

  const translate = async () => {
    if (!guidanceText) return
    try {
      setBusy(true)
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: guidanceText, targetLang: lang }),
      })
      const data = await res.json()
      setTranslated(data?.text)
      toast({ title: "Translated", description: "Localized instructions generated." })
    } catch (e: any) {
      toast({ title: "Translate failed", description: e?.message || "Try again", variant: "destructive" })
    } finally {
      setBusy(false)
    }
  }

  // Prefill a tracking entry via localStorage for faster logging
  const addTrackingEntry = () => {
    if (!result?.topMatches?.[0]) return
    const top = result.topMatches[0]
    const entry = {
      date: new Date().toISOString(),
      crop,
      pest: top.pest,
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
    }
    const key = "krishi_logs"
    const current = JSON.parse(localStorage.getItem(key) || "[]")
    current.push(entry)
    localStorage.setItem(key, JSON.stringify(current))
    toast({ title: "Tracking entry added", description: "Find it in Dashboard > Add details later." })
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Farm Inputs</CardTitle>
          <CardDescription>Provide as much detail as possible for accuracy.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Crop</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rice">Rice</SelectItem>
                  <SelectItem value="Wheat">Wheat</SelectItem>
                  <SelectItem value="Cotton">Cotton</SelectItem>
                  <SelectItem value="Tomato">Tomato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Crop Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vegetative">Vegetative</SelectItem>
                  <SelectItem value="Flowering">Flowering</SelectItem>
                  <SelectItem value="Fruiting">Fruiting</SelectItem>
                  <SelectItem value="Maturity">Maturity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Symptoms (text)</Label>
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., leaf curling, hopper insects, honeydew, borer holes..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Weather & Soil notes</Label>
              <Textarea
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="e.g., recent rains, humid, temp 30C... (add soil notes below)"
              />
              <Textarea
                value={soil}
                onChange={(e) => setSoil(e.target.value)}
                placeholder="e.g., loamy soil, low organic carbon, standing water..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
            <div className="grid gap-2">
              <Label>Optional field image</Label>
              <Input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
              {photo && (
                <Image
                  src={photo || "/placeholder.svg"}
                  alt="Field photo"
                  width={640}
                  height={360}
                  className="w-full h-auto rounded border"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onSubmit} disabled={busy}>
                Diagnose
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Top matches and natural guidance</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="font-medium">Top matches</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5">
                {result.topMatches.map((m) => (
                  <li key={m.pest}>
                    {m.pest} ({m.crop}) — score {Math.round(m.score * 100)}/100
                  </li>
                ))}
              </ul>
            </div>

            <Tabs defaultValue="steps">
              <TabsList>
                <TabsTrigger value="steps">Natural Steps</TabsTrigger>
                <TabsTrigger value="notes">AI Notes</TabsTrigger>
                <TabsTrigger value="voice">Localize & Voice</TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="space-y-3">
                {result.steps.length === 0 && (
                  <p className="text-sm text-muted-foreground">No steps found for the top match.</p>
                )}
                {result.steps.map((s, idx) => (
                  <div key={idx} className="rounded border p-3">
                    <div className="font-medium">
                      {idx + 1}. {s.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{s.detail}</div>
                    <div className="text-xs mt-1">
                      Timing: {s.timing} • Category: {s.category}
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" onClick={addTrackingEntry}>
                    Add tracking entry
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <pre className="whitespace-pre-wrap text-sm bg-secondary p-3 rounded">
                  {result.aiNotes || "No AI notes."}
                </pre>
              </TabsContent>

              <TabsContent value="voice" className="grid gap-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Language</Label>
                    <Select value={lang} onValueChange={setLang}>
                      <SelectTrigger>
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-IN">English (India)</SelectItem>
                        <SelectItem value="hi-IN">Hindi</SelectItem>
                        <SelectItem value="mr-IN">Marathi</SelectItem>
                        <SelectItem value="bn-IN">Bengali</SelectItem>
                        <SelectItem value="te-IN">Telugu</SelectItem>
                        <SelectItem value="ta-IN">Tamil</SelectItem>
                        <SelectItem value="kn-IN">Kannada</SelectItem>
                        <SelectItem value="ml-IN">Malayalam</SelectItem>
                        <SelectItem value="or-IN">Odia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={speak} variant="default">
                      Speak Instructions
                    </Button>
                    <Button variant="outline" onClick={translate} disabled={busy}>
                      Translate with AI
                    </Button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-secondary p-3 rounded min-h-24">
                  {translated || guidanceText}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
