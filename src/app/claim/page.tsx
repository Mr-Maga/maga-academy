import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/brand";
import { SignOutButton } from "@/components/sign-out-button";
import { getProfile, requireUser } from "@/lib/dal";
import { ClaimForm } from "./claim-form";

export const metadata: Metadata = { title: "Set your role" };

export default async function ClaimPage() {
  await requireUser();
  const profile = await getProfile();

  if (profile?.code_claimed) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 flex justify-center">
        <Wordmark />
      </div>

      <div className="card p-6 shadow-2xl shadow-black/40">
        <h1 className="text-xl font-bold">One last step</h1>
        <p className="mt-1 text-sm text-muted">
          Enter the code from your teacher or the centre to activate your account. You only do
          this once.
        </p>

        <div className="mt-6">
          <ClaimForm />
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-subtle">
        Students &amp; parents start as <span className="text-muted">pending</span> until the
        centre approves access.
      </p>

      <div className="mx-auto mt-6 w-40">
        <SignOutButton label="Use a different account" />
      </div>
    </main>
  );
}
