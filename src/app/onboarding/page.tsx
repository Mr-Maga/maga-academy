import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireActiveProfile } from "@/lib/dal";
import { OnboardingChoice } from "./onboarding-choice";

export const metadata: Metadata = { title: "Boshlash" };

// Top-level (outside the app shell) so the app layout's onboarding redirect
// doesn't loop. Only un-onboarded students land here.
export default async function OnboardingPage() {
  const profile = await requireActiveProfile();
  if (profile.role !== "student") redirect("/dashboard");
  if (profile.learning_path) redirect("/dashboard");

  const first = (profile.full_name || profile.email || "do‘st").split(/[ @]/)[0];
  return <OnboardingChoice firstName={first} />;
}
