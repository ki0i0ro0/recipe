"use server";
import { getMenus, getRecipe } from "@/server/firestore";
import { getServerSession } from "next-auth";

export const getRecipeMenu = async () => {
  const session = await getServerSession();
  const recipe = await getRecipe({ email: session?.user?.email || "" });
  const menus = await getMenus();
  return { recipe, menus };
};
