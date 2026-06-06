import type { Metadata } from "next";
import { requireRole } from "@/lib/dal";
import { getAcademyInfo } from "@/lib/settings";
import { PageHeader, Card } from "@/components/ui";
import { SubmitButton } from "@/components/form-controls";
import { updateAcademy } from "../actions";

export const metadata: Metadata = { title: "Academy info" };

export default async function AcademyInfoPage() {
  await requireRole("admin");
  const info = await getAcademyInfo();
  const price = (plan: string) => info.prices.find((p) => p.plan === plan)?.price ?? "";

  return (
    <div>
      <PageHeader
        title="Academy info"
        subtitle="The AI tutor uses these facts to answer about prices, schedule and contact."
      />
      <Card>
        <form action={updateAcademy} className="space-y-3">
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" defaultValue={info.name} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="about">About</label>
            <textarea id="about" name="about" rows={2} defaultValue={info.about} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="contactTelegram">Telegram</label>
              <input id="contactTelegram" name="contactTelegram" defaultValue={info.contactTelegram} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="schedule">Schedule</label>
              <input id="schedule" name="schedule" defaultValue={info.schedule} className="input" />
            </div>
          </div>

          <div className="rounded-xl border border-border p-3">
            <div className="mb-2 text-sm font-semibold">Monthly prices</div>
            <div className="space-y-2">
              <PriceRow label="IELTS" name="price_ielts" value={price("IELTS")} />
              <PriceRow label="CEFR" name="price_cefr" value={price("CEFR")} />
              <PriceRow label="General (A1–B2)" name="price_general" value={price("General English (A1–B2)")} />
            </div>
          </div>

          <SubmitButton className="btn-primary w-full py-2.5" pendingLabel="Saving…">
            Save academy info
          </SubmitButton>
        </form>
      </Card>
    </div>
  );
}

function PriceRow({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-sm text-muted">{label}</span>
      <input name={name} defaultValue={value} className="input py-2" placeholder="e.g. 800 000 so'm / oy" />
    </label>
  );
}
