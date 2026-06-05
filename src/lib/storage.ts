import "server-only";
import { createClient } from "./supabase/server";

/** Build a path → signed-URL map for files in a private bucket. */
export async function signedUrls(
  bucket: "materials" | "submissions",
  paths: (string | null | undefined)[],
  expiresIn = 3600,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const real = paths.filter((p): p is string => Boolean(p));
  if (real.length === 0) return map;
  const supabase = await createClient();
  const { data } = await supabase.storage.from(bucket).createSignedUrls(real, expiresIn);
  for (const d of data ?? []) {
    if (d.signedUrl && d.path) map.set(d.path, d.signedUrl);
  }
  return map;
}
