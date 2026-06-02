import * as React from "react";
import { approvedInsects, type ApprovedInsect } from "@/data/regulations";
import { StickerCard } from "@/components/insectalert/StickerCard";
import { Blob } from "@/components/insectalert/Blob";
import { cn } from "@/lib/utils";

export type ListCardProps = {
  dataQuery: {
    topic?:
      | "approved_insects"
      | "pending_insects"
      | "approval_timeline"
      | "regulation_item";
    sort?: "asc" | "desc";
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

export function ListCard({ dataQuery }: ListCardProps) {
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

  // approval_timeline → 1AM-246 (timeline-card); regulation_item → decoder-card.
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
