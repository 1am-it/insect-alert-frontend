import * as React from "react";
import { approvedInsects, type ApprovedInsect } from "@/data/regulations";
import { resolvePattern, type Pattern } from "@/data/patterns";
import { StickerCard } from "@/components/insectalert/StickerCard";
import { Blob } from "@/components/insectalert/Blob";
import { cn } from "@/lib/utils";

export type ListCardProps = {
  dataQuery: {
    // regulation list
    topic?:
      | "approved_insects"
      | "pending_insects"
      | "approval_timeline"
      | "regulation_item";
    sort?: "asc" | "desc";
    // decoder comparison
    lookup?: "id" | "eNumber" | "latinName" | "synonym" | "comparison";
    ids?: string[];
  };
};

function CategoryPill({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: "ink" | "alert" | "warn" | "muted";
}) {
  const toneClass =
    tone === "alert"
      ? "bg-alert-accent text-primary-foreground"
      : tone === "warn"
      ? "bg-warn-accent text-primary-foreground"
      : tone === "muted"
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
      <Blob tone="sun" size={140} className="-right-10 -top-10 opacity-50" />
      <Blob tone="mint" size={100} className="-bottom-8 -left-8 opacity-40" />
      <div className="relative z-10 flex flex-col gap-4">{children}</div>
    </StickerCard>
  );
}

function InsectRow({ insect }: { insect: ApprovedInsect }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-cream/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <h3 className="font-display text-lg font-bold leading-tight text-ink">
          {insect.nlName}
        </h3>
        <span className="text-xs font-medium text-muted-foreground">
          {insect.regulationCode}
        </span>
      </div>
      <p className="text-sm italic text-muted-foreground">{insect.latinName}</p>
      {insect.allowedCategories.length > 0 && (
        <p className="mt-1 text-sm leading-relaxed text-ink/80">
          Toegestaan in: {insect.allowedCategories.join(", ")}.
        </p>
      )}
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        Bron: {insect.source}
      </p>
    </div>
  );
}

const SOURCE_CITATION =
  "Bron: NVWA, Foodwatch NL, EU Implementing Regulation 2017/2470";

/** One column in a comparison: a resolved pattern shown as a labelled card. */
function ComparisonItem({ pattern }: { pattern: Pattern }) {
  const typeLabel =
    pattern.certainty === "twijfel"
      ? "Twijfelgeval"
      : pattern.type === "colorant"
      ? "Additief"
      : pattern.type === "insect"
      ? "Insect"
      : "Ingredient";
  const tone: "ink" | "alert" | "warn" =
    pattern.certainty === "twijfel"
      ? "warn"
      : pattern.type === "colorant"
      ? "alert"
      : "ink";

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-border/60 bg-cream/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryPill tone={tone}>{typeLabel}</CategoryPill>
        {pattern.pending && <CategoryPill tone="warn">Nog niet toegelaten</CategoryPill>}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-display text-lg font-bold leading-tight text-ink">
          {pattern.nlName ?? "Onbekend ingredient"}
        </h3>
        {pattern.latinName && (
          <p className="text-sm italic text-muted-foreground">{pattern.latinName}</p>
        )}
      </div>
      <p className="text-sm leading-relaxed text-ink/85">{pattern.decoderText}</p>
    </div>
  );
}

/**
 * Comparison view: resolves dataQuery.ids to patterns and shows them side by
 * side. Defensive about the classifier output, which we observed can be messy:
 *   - ids may be labels ("kleine meelworm") not slugs — resolvePattern handles
 *     this via its nlName / regex / substring matching.
 *   - ids may contain an extra generic term ("meelworm") that resolves to a
 *     pattern already shown — we dedupe on the resolved pattern.id.
 *   - ids that don't resolve are skipped.
 * If fewer than two distinct patterns survive, we fall back to a notice rather
 * than render a one-sided or empty comparison.
 */
function ComparisonView({ ids }: { ids: string[] }) {
  const resolved: Pattern[] = [];
  const seen = new Set<string>();
  for (const raw of ids) {
    if (typeof raw !== "string") continue;
    // Classifier ids have no stable shape — observed "kleine meelworm"
    // (spaces), "kleine-meelworm" (hyphens) and "kleine_meelworm"
    // (underscores) across prompt versions. Normalise separators to spaces
    // before resolving so any form matches. Done locally here, NOT inside
    // resolvePattern, to avoid affecting single-lookup decoder cases.
    const normalized = raw.replace(/[_-]/g, " ").trim();
    const p = resolvePattern(normalized);
    if (!p) continue;
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    resolved.push(p);
    if (resolved.length === 3) break; // cap — comparisons stay readable
  }

  if (resolved.length < 2) {
    return (
      <Shell>
        <CategoryPill tone="muted">Vergelijking</CategoryPill>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          We konden deze vergelijking niet maken
        </h2>
        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
          We hebben minstens twee bekende ingredienten nodig om te vergelijken.
          Stel je vraag eventueel opnieuw met de volledige namen.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <CategoryPill tone="muted">Vergelijking</CategoryPill>
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        {resolved.map((p) => p.nlName).filter(Boolean).join(" vs ")}
      </h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        {resolved.map((p) => (
          <ComparisonItem key={p.id} pattern={p} />
        ))}
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        {SOURCE_CITATION}
      </p>
    </Shell>
  );
}

export function ListCard({ dataQuery }: ListCardProps) {
  // Decoder comparison (lookup="comparison" + ids) takes precedence over topic.
  if (dataQuery.lookup === "comparison" && Array.isArray(dataQuery.ids)) {
    return <ComparisonView ids={dataQuery.ids} />;
  }

  const topic = dataQuery.topic;

  if (topic === "pending_insects") {
    return (
      <Shell>
        <CategoryPill tone="muted">EU-regelgeving</CategoryPill>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Geen insecten in de pijplijn
        </h2>
        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
          Er staan momenteel geen aanvullende insecten als pending in deze
          dataset. Zodra de EU nieuwe soorten goedkeurt, verschijnen ze hier.
        </p>
      </Shell>
    );
  }

  if (topic === "approved_insects") {
    const sorted =
      dataQuery.sort === "desc"
        ? [...approvedInsects].reverse()
        : approvedInsects;

    return (
      <Shell>
        <CategoryPill>EU-goedgekeurd</CategoryPill>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          In de EU goedgekeurde insecten
        </h2>
        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
          Deze {sorted.length} soorten mogen in de EU in voedingsmiddelen
          worden verwerkt. Karmijn (E120) valt onder de oudere
          additievenregelgeving.
        </p>
        <div className="mt-1 flex flex-col gap-3">
          {sorted.map((insect) => (
            <InsectRow key={insect.id} insect={insect} />
          ))}
        </div>
      </Shell>
    );
  }

  // approval_timeline -> 1AM-246 (timeline-card); regulation_item -> decoder-card.
  // Neither is handled here; render a graceful fallback.
  return (
    <Shell>
      <CategoryPill tone="muted">EU-regelgeving</CategoryPill>
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Deze weergave is nog niet beschikbaar
      </h2>
      <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
        Komt eraan in een volgende versie.
      </p>
    </Shell>
  );
}

export default ListCard;
