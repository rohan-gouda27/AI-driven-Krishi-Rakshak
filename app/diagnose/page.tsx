import { DiagnosisForm } from "@/components/diagnosis-form"

export default function DiagnosePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Diagnose Pest & Get Natural Remedies</h1>
      <p className="text-muted-foreground mt-2">
        Fill the details below. The agent combines a knowledge base and AI reasoning to suggest accurate, natural
        treatments.
      </p>
      <div className="mt-6">
        <DiagnosisForm />
      </div>
    </main>
  )
}
