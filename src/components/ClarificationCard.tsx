import * as React from "react";
import { StickerCard } from "@/components/insectalert/StickerCard";
import { Blob } from "@/components/insectalert/Blob";
import { PillButton } from "@/components/insectalert/PillButton";
import { cn } from "@/lib/utils";
import { askQuestion, type ClassifierResponse } from "@/lib/insectalert-api";

export type ClarificationInterpretation = {
  label: string;
  rewrittenQuestion: string;
};

export type ClarificationCardProps = {
  dataQuery: {
    originalQuestion?: string;
    interpretations: ClarificationInterpretation[];
  };
  onResolved?: (response: ClassifierResponse, chosen: ClarificationInterpretation) => void;
};

function CategoryPill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "ink" | "muted";
}) {
  const toneClass =
    tone === "muted"
      ? "bg-muted text-muted-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <StickerCard tone="white" size="lg" className="relative overflow-hidden p-6 sm:p-8">
      <Blob tone="sky" size={140} className="-right-10 -top-10 opacity-50" />
      <Blob tone="sun" size={100} className="-bottom-8 -left-8 opacity-40" />
      <div className="relative z-10 flex flex-col gap-4">{children}</div>
    </StickerCard>
  );
}

export function ClarificationCard({ dataQuery, onResolved }: ClarificationCardProps) {
  const { originalQuestion, interpretations } = dataQuery;
  const [pendingIndex, setPendingIndex] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  if (!interpretations || interpretations.length === 0) {
    return (
      <Shell>
        <CategoryPill>Verduidelijking</CategoryPill>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          We hebben meer context nodig
        </h2>
        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
          Probeer de vraag iets specifieker te stellen.
        </p>
      </Shell>
    );
  }

  async function handleSelect(option: ClarificationInterpretation, index: number) {
    setPendingIndex(index);
    setError(null);

    try {
      const data = await askQuestion(option.rewrittenQuestion);
      onResolved?.(data, option);
    } catch {
      setError("De vraag kon niet opnieuw worden geanalyseerd.");
    } finally {
      setPendingIndex(null);
    }
  }

  return (
    <Shell>
      <CategoryPill>Verduidelijking</CategoryPill>

      <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
        Wat bedoel je precies?
      </h2>

      {originalQuestion && (
        <p className="text-sm leading-relaxed text-ink/70 sm:text-base">
          Je vroeg: <span className="italic">"{originalQuestion}"</span>. Kies de
          interpretatie die het beste past.
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {interpretations.map((option, index) => (
          <PillButton
            key={`${option.label}-${index}`}
            tone="cream"
            size="sm"
            type="button"
            disabled={pendingIndex !== null}
            onClick={() => handleSelect(option, index)}
          >
            {pendingIndex === index ? "Bezig…" : option.label}
          </PillButton>
        ))}
      </div>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </Shell>
  );
}

export default ClarificationCard;
