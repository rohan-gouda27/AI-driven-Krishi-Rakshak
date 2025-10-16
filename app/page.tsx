"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col">
      <header className="w-full border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/placeholder-logo.png" alt="KrishiRakshak" width={32} height={32} className="rounded" />
            <span className="font-semibold">KrishiRakshak</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/diagnose">Diagnose</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/diagnose">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6">
        <div className="rounded-lg p-6 bg-secondary">
          <h1 className="text-2xl md:text-3xl font-semibold text-balance">
            AI-driven Smart Pest Management for Natural Farming
          </h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Detect pests early, recommend natural treatments, guide step-by-step in local language or voice, and track
            outcomes against chemical methods.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Button asChild>
              <Link href="/diagnose">Start a Diagnosis</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">View Effectiveness</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Detect & Diagnose</CardTitle>
              <CardDescription>Use crop, stage, symptoms, and images.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Heuristic knowledge + optional AI reasoning creates accurate early detection.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Natural Treatments</CardTitle>
              <CardDescription>Bio-pesticides, cultural practices, predator release.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Step-by-step, localized guidance with voice playback.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Track Effectiveness</CardTitle>
              <CardDescription>Compare natural vs chemical outcomes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Logs stored locally for quick field pilots and field demos.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="mt-auto w-full border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground">
          Built with natural farming in mind — prioritize soil health, biodiversity, and farmer well-being.
        </div>
      </footer>
    </main>
  )
}
