import { createFileRoute } from "@tanstack/react-router";
import { QuestionResolver } from "@/components/QuestionResolver";
import type { ClassifierResponse } from "@/lib/insectalert-api";

export const Route = createFileRoute("/preview/clarification-card")({
  head: () => ({
    meta: [
      { title: "Preview — ClarificationCard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewClarificationCardPage,
});

/** Build an ambiguous classifier-response so the preview exercises the real
 *  production path: QuestionResolver → ClarificationCard → pill → askQuestion()
 *  → resolved card rendered in-place. */
function ambiguous(
  dataQuery: Record<string, unknown>,
): ClassifierResponse {
  return {
    category: "ambiguous",
    component: "clarification-card",
    dataQuery,
    deflectionTarget: null,
    confidence: "low",
  };
}

const fixtures: Array<{ label: string; response: ClassifierResponse }> = [
  {
    label: "1. Happy path — 'Is meelworm gezond?' (pill-klik lost in-place op)",
    response: ambiguous({
      originalQuestion: "Is meelworm gezond?",
      interpretations: [
        {
          label: "Voedingswaarde van meelworm",
          rewrittenQuestion: "Wat is de voedingswaarde van gele meelworm?",
        },
        {
          label: "Is meelworm veilig om te eten?",
          rewrittenQuestion: "Is gele meelworm in de EU toegelaten als voedsel?",
        },
        {
          label: "Allergische reacties",
          rewrittenQuestion: "Kan ik allergisch zijn voor meelworm?",
        },
      ],
    }),
  },
  {
    label: "2. 'Karmijn — gevaarlijk of veilig?'",
    response: ambiguous({
      originalQuestion: "Karmijn — gevaarlijk of veilig?",
      interpretations: [
        { label: "Wat is karmijn (E120)?", rewrittenQuestion: "Wat is karmijn (E120)?" },
        {
          label: "Allergie of bijwerkingen",
          rewrittenQuestion: "Kan karmijn (E120) allergische reacties veroorzaken?",
        },
        {
          label: "EU-toelating",
          rewrittenQuestion: "Is karmijn (E120) toegelaten in EU-voedsel?",
        },
      ],
    }),
  },
  {
    label: "3. 'Hoe zit dat?' — te vaag",
    response: ambiguous({
      originalQuestion: "Hoe zit dat?",
      interpretations: [
        {
          label: "Insecten in voedsel algemeen",
          rewrittenQuestion: "Welke insecten zijn in de EU toegelaten in voedsel?",
        },
        {
          label: "Etikettering",
          rewrittenQuestion: "Hoe herken ik insecten op een etiket?",
        },
      ],
    }),
  },
  {
    label: "4. Edge case — geen interpretaties (empty-state)",
    response: ambiguous({ originalQuestion: "???", interpretations: [] }),
  },
];

function PreviewClarificationCardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview (hidden route)
          </p>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            ClarificationCard fixtures
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerenderd via <code>QuestionResolver</code> — een pill-klik roept{" "}
            <code>askQuestion()</code> aan en vervangt de kaart in-place door het
            opgeloste resultaat.
          </p>
        </header>

        {fixtures.map((f, i) => (
          <section key={i} className="flex flex-col gap-3">
            <p className="text-xs font-mono text-muted-foreground">{f.label}</p>
            <QuestionResolver classifierResponse={f.response} />
          </section>
        ))}
      </div>
    </main>
  );
}
