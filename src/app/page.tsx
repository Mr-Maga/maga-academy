import { redirect } from "next/navigation";
import { getUser } from "@/lib/dal";

// Root: route to the app if signed in, otherwise to the login screen.
export default async function Home() {
  const user = await getUser();
  redirect(user ? "/dashboard" : "/login");
}
