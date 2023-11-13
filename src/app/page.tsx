import { TopPage } from "@/components/TopPage";
import { getServerSession } from "next-auth";
import { getCookedMenu } from "./actions";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (session) {
    return <TopPage />;
  }
  redirect("/login");
}
