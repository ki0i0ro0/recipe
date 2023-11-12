import { TopPage } from "@/components/TopPage";
import { Login } from "@/components/login";
import { getServerSession } from "next-auth";
import { getRecipeMenu } from "./actions";

export default async function Page() {
  const session = await getServerSession();
  if (session) {
    const data = await getRecipeMenu();
    return <TopPage data={data} />;
  }
  return <Login />;
}
