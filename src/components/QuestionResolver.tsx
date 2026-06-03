import * as React from "react";
import { DecoderCard } from "@/components/DecoderCard";
import { DeflectionCard } from "@/components/DeflectionCard";
import { ClarificationCard } from "@/components/ClarificationCard";
import { ListCard } from "@/components/ListCard";
import { TimelineCard } from "@/components/TimelineCard";
import { StickerCard } from "@/components/insectalert/StickerCard";
import { Blob } from "@/components/insectalert/Blob";
import type { ClassifierResponse } from "@/lib/insectalert-api";

export type { ClassifierResponse };

export type QuestionResolverProps = {
  classifierResponse: ClassifierResponse;
  /**
   * Whether an interactive clarification-card may resolve into a new card
   * in-place. True at the top level; set false for the single nested
   * re-render so the loop stays bounded to one step — no infinite recursion
   * and no multi-step clarification chains (out of scope, 1AM-247).
   */
  enableClarificationResolve?: boolean;
};

function FallbackCard({ classifierResponse }: QuestionResolverProps) {
  return (
    <StickerCard tone="white" size="lg" className="relative overflow-hidden p-6 sm:p-8">
      <Blob tone="sky" size={140} className="-right-10 -top-10 opacity-50" />
      <Blob tone="coral" size={100} className="-bottom-8 -left-8 opacity-40" />
      <div className="relative z-10 flex flex-col gap-4">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Dit soort vraag kunnen we nog niet visualiseren
        </h2>
        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
          Komt eraan in een volgende versie.
        </p>
        <details className="mt-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer select-none">
            Debug info (alleen op deze preview)
          </summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-muted p-3 font-mono text-[11px] text-ink/80">
{JSON.stringify(classifierResponse, null, 2)}
          </pre>
        </details>
      </div>
    </StickerCard>
  );
}

export function QuestionResolver({
  classifierResponse,
  enableClarificationResolve = true,
}: QuestionResolverProps) {
  // Holds the follow-up response after a clarification pill is chosen, so we
  // can swap the ClarificationCard for the resolved card in-place.
  const [resolved, setResolved] = React.useState<ClassifierResponse | null>(null);

  // Reset resolution when a brand-new top-level response arrives (e.g. the
  // user asks another question), otherwise a stale resolved card would stick.
  const prevResponseRef = React.useRef(classifierResponse);
  if (prevResponseRef.current !== classifierResponse) {
    prevResponseRef.current = classifierResponse;
    setResolved(null);
  }

  // A resolved clarification renders its follow-up card here. Disable further
  // resolution one level down to keep the loop single-step and bounded.
  if (resolved) {
    return (
      <QuestionResolver
        classifierResponse={resolved}
        enableClarificationResolve={false}
      />
    );
  }

  const { component, dataQuery, deflectionTarget } = classifierResponse;

  if (component === "decoder-card") {
    return (
      <DecoderCard
        dataQuery={dataQuery as React.ComponentProps<typeof DecoderCard>["dataQuery"]}
      />
    );
  }

  if (component === "list-card") {
    return (
      <ListCard
        dataQuery={dataQuery as React.ComponentProps<typeof ListCard>["dataQuery"]}
      />
    );
  }

  if (component === "timeline-card") {
    return (
      <TimelineCard
        dataQuery={dataQuery as React.ComponentProps<typeof TimelineCard>["dataQuery"]}
      />
    );
  }

  if (component === "deflection-card") {
    return (
      <DeflectionCard
        dataQuery={
          dataQuery as React.ComponentProps<typeof DeflectionCard>["dataQuery"]
        }
        deflectionTarget={
          deflectionTarget as React.ComponentProps<
            typeof DeflectionCard
          >["deflectionTarget"]
        }
      />
    );
  }

  if (component === "clarification-card") {
    return (
      <ClarificationCard
        dataQuery={
          dataQuery as React.ComponentProps<typeof ClarificationCard>["dataQuery"]
        }
        onResolved={
          enableClarificationResolve
            ? (response) => setResolved(response)
            : undefined
        }
      />
    );
  }

  return <FallbackCard classifierResponse={classifierResponse} />;
}

export default QuestionResolver;
