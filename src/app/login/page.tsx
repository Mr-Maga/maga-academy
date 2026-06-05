import type { Metadata } from "next";
import { Wordmark } from "@/components/brand";
import { GoogleButton } from "./google-button";
import { EmailForm } from "./email-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/dashboard";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 flex justify-center">
        <Wordmark />
      </div>

      <div className="card p-6 shadow-2xl shadow-black/40">
        <h1 className="text-center text-xl font-bold">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-muted">
          Sign in to continue your IELTS journey.
        </p>

        {error && (
          <p className="mt-4 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-center text-sm text-danger">
            Sign-in failed. Please try again.
          </p>
        )}

        <div className="mt-6">
          <GoogleButton next={safeNext} />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-subtle">
          <span className="h-px flex-1 bg-border" />
          or use email
          <span className="h-px flex-1 bg-border" />
        </div>

        <EmailForm />
      </div>

      <p className="mt-6 px-4 text-center text-xs text-subtle">
        After signing in for the first time you&apos;ll enter a one-time code to set your role.
      </p>
    </main>
  );
}
