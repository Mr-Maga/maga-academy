import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader, Card } from "@/components/ui";
import { PlacementClient } from "./placement-client";

export const metadata: Metadata = { title: "Placement test" };

export default async function PlacementPage() {
  await requireActiveProfile();

  return (
    <div className="space-y-5">
      <PageHeader title="Placement test" subtitle="Reading, listening & speaking — find your level." />
      <Card className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary-soft">
          <Compass className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted">
          Answer honestly — the questions get harder. We&apos;ll recommend a level and send it to the
          centre.
        </p>
      </Card>
      <PlacementClient />
    </div>
  );
}
