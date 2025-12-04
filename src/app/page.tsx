import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { TopPage } from "@/components/TopPage";

export default async function Page() {
  const session = await getServerSession();
  if (session) {
    return <TopPage />;
  }
  redirect("/login");
}
