import Link from "next/link";
import { Wordmark } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-5 text-center">
      <Wordmark />
      <div>
        <div className="text-6xl font-black text-primary-soft">404</div>
        <p className="mt-2 text-muted">This page doesn’t exist.</p>
      </div>
      <Link href="/dashboard" className="btn-primary px-5 py-2.5">
        Back to dashboard
      </Link>
    </main>
  );
}
