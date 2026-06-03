import { createFileRoute } from "@tanstack/react-router";
import { ListCard } from "@/components/ListCard";

export const Route = createFileRoute("/preview/list-card")({
  head: () => ({
    meta: [
      { title: "Preview — ListCard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewListCardPage,
});

function PreviewListCardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview (hidden route)
          </p>
          <h1 className="font-display text-3xl font-bold text-ink">
            ListCard (preview)
          </h1>
          <p className="text-sm text-muted-foreground">
            Standalone test van de list-card voor regulation-topics en
            decoder-comparison.
          </p>
        </header>

        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            topic: approved_insects
          </p>
          <ListCard dataQuery={{ topic: "approved_insects" }} />
        </section>

        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            topic: pending_insects (empty state)
          </p>
          <ListCard dataQuery={{ topic: "pending_insects" }} />
        </section>

        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            comparison: kleine vs gele meelworm (twee labels)
          </p>
          <ListCard
            dataQuery={{
              lookup: "comparison",
              ids: ["kleine meelworm", "gele meelworm"],
            }}
          />
        </section>

        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            comparison: messy ids (derde term "meelworm" → dedupe)
          </p>
          <ListCard
            dataQuery={{
              lookup: "comparison",
              ids: ["kleine meelworm", "gele meelworm", "meelworm"],
            }}
          />
        </section>

        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            comparison: te weinig resolvebaar (fallback)
          </p>
          <ListCard
            dataQuery={{
              lookup: "comparison",
              ids: ["onbekend xyz", "nog onbekender"],
            }}
          />
        </section>
      </div>
    </main>
  );
}
