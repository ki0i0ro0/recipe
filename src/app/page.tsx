import { TopPage } from "@/components/TopPage";
import { getServerSession } from "next-auth";
import { getRecipeMenu } from "./actions";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (session) {
    const data = await getRecipeMenu();
    return <TopPage data={data} />;
  }
  redirect("/login");
}
