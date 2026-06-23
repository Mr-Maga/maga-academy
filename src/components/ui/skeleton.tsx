import { cn } from "@/lib/utils";

/** Shimmering skeleton — never a bare spinner on a blank screen. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton rounded-xl", className)} {...props} />;
}

/** A ready-made skeleton matching a content card. */
export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-5/6" />
    </div>
  );
}
