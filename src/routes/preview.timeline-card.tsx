import { createFileRoute } from "@tanstack/react-router";
import { TimelineCard } from "@/components/TimelineCard";

export const Route = createFileRoute("/preview/timeline-card")({
  head: () => ({
    meta: [
      { title: "Preview — TimelineCard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewTimelineCardPage,
});

function PreviewTimelineCardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview (hidden route)
          </p>
          <h1 className="font-display text-3xl font-bold text-ink">
            TimelineCard (preview)
          </h1>
          <p className="text-sm text-muted-foreground">
            Standalone test van de timeline-card voor goedkeuringstijdlijnen.
          </p>
        </header>

        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            single: gele meelworm (3 stappen)
          </p>
          <TimelineCard
            dataQuery={{ topic: "approval_timeline", insectId: "gele-meelworm" }}
          />
        </section>

        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            single: schildluis / E120 (edge-case, geen tijdlijn)
          </p>
          <TimelineCard
            dataQuery={{ topic: "approval_timeline", insectId: "schildluis" }}
          />
        </section>

        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            multi: alle insecten chronologisch (zonder E120)
          </p>
          <TimelineCard dataQuery={{ topic: "approval_timeline" }} />
        </section>
      </div>
    </main>
  );
}
