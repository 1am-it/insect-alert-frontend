import * as React from "react";
import { approvedInsects, type ApprovedInsect } from "@/data/regulations";
import { StickerCard } from "@/components/insectalert/StickerCard";
import { Blob } from "@/components/insectalert/Blob";
import { cn } from "@/lib/utils";

export type TimelineCardProps = {
  dataQuery: {
    topic?:
      | "approved_insects"
      | "pending_insects"
      | "approval_timeline"
      | "regulation_item";
    insectId?: string;
    sort?: "asc" | "desc";
  };
};

/**
 * A timeline step derived from the regulation dataset. Only the three steps
 * the data reliably contains are rendered (1AM-246, optie a):
 *   1. EFSA-beoordeling gestart  (efsaAssessmentStarted, year)
 *   2. EFSA positief beoordeeld  (efsaAssessmentPositive, ISO month)
 *   3. EU-goedkeuring            (approvalDate + regulationCode/Url)
 * No steps are invented; missing fields are skipped defensively.
 */
type Step = {
  label: string;
  date: string;
  source?: { code: string; url: string };
};

/** Format an ISO-ish date string to a readable Dutch form. Defensive: handles
 *  year-only ("2018"), year-month ("2021-07"), and full ISO ("2021-06-01"). */
function formatDate(value: string): string {
  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
  ];
  const parts = value.split("-");
  if (parts.length === 1) return parts[0]; // year only
  const year = parts[0];
  const monthIdx = Number(parts[1]) - 1;
  const month = months[monthIdx] ?? "";
  if (parts.length === 2) return `${month} ${year}`.trim();
  return `${parts[2]} ${month} ${year}`.trim();
}

/** Build the ordered steps for one insect, skipping any missing field. */
function buildSteps(insect: ApprovedInsect): Step[] {
  const steps: Step[] = [];
  if (insect.efsaAssessmentStarted) {
    steps.push({
      label: "EFSA-beoordeling gestart",
      date: formatDate(insect.efsaAssessmentStarted),
    });
  }
  if (insect.efsaAssessmentPositive) {
    steps.push({
      label: "EFSA positief beoordeeld",
      date: formatDate(insect.efsaAssessmentPositive),
    });
  }
  if (insect.approvalDate) {
    steps.push({
      label: "EU-goedkeuring",
      date: formatDate(insect.approvalDate),
      source: { code: insect.regulationCode, url: insect.regulationUrl },
    });
  }
  return steps;
}

function CategoryPill({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: "ink" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
        tone === "muted"
          ? "bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground",
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

/** Vertical timeline rail with dotted steps. */
function Timeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative flex flex-col gap-4 border-l-2 border-border/60 pl-5">
      {steps.map((step, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[27px] top-1 inline-flex h-3 w-3 items-center justify-center rounded-full border-2 border-card bg-primary" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-ink">{step.label}</span>
            <span className="text-sm text-muted-foreground">{step.date}</span>
            {step.source && (
              <a
                href={step.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary underline underline-offset-2"
              >
                {step.source.code}
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** E120 / Schildluis has no novel-food EFSA timeline — explain instead of
 *  rendering an empty rail. (Pre-1997, additives regulation 1333/2008.) */
function NoTimelineExplainer({ insect }: { insect: ApprovedInsect }) {
  return (
    <Shell>
      <CategoryPill tone="muted">EU-regelgeving</CategoryPill>
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        {insect.nlName}
      </h2>
      <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
        {insect.nlName} kent geen novel-food-tijdlijn. Het valt onder de oudere
        additievenregelgeving (Verordening (EG) 1333/2008) en was al vóór 1997
        toegestaan als kleurstof — er is dus geen EFSA-beoordelingstraject met
        losse stappen zoals bij de recent goedgekeurde insecten.
      </p>
      <a
        href={insect.regulationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-primary underline underline-offset-2"
      >
        {insect.regulationCode}
      </a>
    </Shell>
  );
}

export function TimelineCard({ dataQuery }: TimelineCardProps) {
  // Single-insect timeline
  if (dataQuery.insectId) {
    const insect = approvedInsects.find((x) => x.id === dataQuery.insectId);

    if (!insect) {
      return (
        <Shell>
          <CategoryPill tone="muted">EU-regelgeving</CategoryPill>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Geen tijdlijn gevonden
          </h2>
          <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
            We hebben geen goedkeuringstijdlijn voor dit insect. Stel eventueel
            een nieuwe vraag.
          </p>
        </Shell>
      );
    }

    const steps = buildSteps(insect);
    if (steps.length === 0) {
      return <NoTimelineExplainer insect={insect} />;
    }

    return (
      <Shell>
        <CategoryPill>Goedkeuringstijdlijn</CategoryPill>
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {insect.nlName}
          </h2>
          <p className="text-sm italic text-muted-foreground">
            {insect.latinName}
          </p>
        </div>
        <Timeline steps={steps} />
      </Shell>
    );
  }

  // Multi-insect timeline — all insects with a valid approvalDate, chronological.
  // E120/Schildluis (approvalDate=null) is excluded from the sort and shown as
  // a footnote, never passed to the date comparison.
  const withTimeline = approvedInsects.filter((x) => x.approvalDate);
  const withoutTimeline = approvedInsects.filter((x) => !x.approvalDate);

  const sorted = [...withTimeline].sort((a, b) => {
    const cmp = (a.approvalDate as string).localeCompare(b.approvalDate as string);
    return dataQuery.sort === "desc" ? -cmp : cmp;
  });

  return (
    <Shell>
      <CategoryPill>Goedkeuringstijdlijn</CategoryPill>
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Wanneer werden insecten in de EU goedgekeurd?
      </h2>
      <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
        De volgorde waarin insecten als novel food zijn toegelaten in de EU.
      </p>
      <ol className="relative flex flex-col gap-4 border-l-2 border-border/60 pl-5">
        {sorted.map((insect) => (
          <li key={insect.id} className="relative">
            <span className="absolute -left-[27px] top-1 inline-flex h-3 w-3 items-center justify-center rounded-full border-2 border-card bg-primary" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink">
                {insect.nlName}
              </span>
              <span className="text-sm text-muted-foreground">
                {insect.approvalDate ? formatDate(insect.approvalDate) : ""}
              </span>
              <a
                href={insect.regulationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary underline underline-offset-2"
              >
                {insect.regulationCode}
              </a>
            </div>
          </li>
        ))}
      </ol>
      {withoutTimeline.length > 0 && (
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {withoutTimeline.map((x) => x.nlName).join(", ")} valt onder oudere
          additievenregelgeving (geen novel-food-tijdlijn).
        </p>
      )}
    </Shell>
  );
}

export default TimelineCard;
