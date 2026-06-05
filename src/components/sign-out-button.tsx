import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";

export function SignOutButton({ className, label = "Sign out" }: { className?: string; label?: string }) {
  return (
    <form action={signOut}>
      <button type="submit" className={cn("btn-ghost w-full", className)}>
        <LogOut className="h-4 w-4" />
        {label}
      </button>
    </form>
  );
}
