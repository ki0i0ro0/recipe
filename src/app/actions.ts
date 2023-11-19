"use server";
import {
  addUserRecipe,
  deleteMenu,
  getMenus,
  getUserIdByEmail,
  getRecipesByUserId,
  deleteUserRecipe,
  updateMenu,
  getMenu,
  deleteUserRecipes,
  getRecipe,
} from "@/server/firestore";
import { AppMenu } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const handleGetUserMenu = async () => {
  const email = await getEmail();
  const userId = await getUserIdByEmail({ email });
  const recipes = await getRecipesByUserId({ userId });
  const menus = await getMenus();
  const cookedMenus: AppMenu[] = menus.map((menu) => {
    const cookedMenu = recipes.find((v) => v.menuId.toString() === menu.id);
    return {
      menuId: menu.id,
      menuName: menu.name,
      menuPhoneticGuides: menu.phoneticGuides,
      createdAt: cookedMenu?.createdAt,
      recipeId: cookedMenu?.id || "",
    };
  });
  return cookedMenus;
};

export const handleAddUserRecipe = async (data: FormData) => {
  const email = await getEmail();
  const userId = await getUserIdByEmail({ email });
  const menuId = String(data.get("menuId"));
  await addUserRecipe({ userId, menuId });
  redirect("/");
};

export const handleDeleteUserRecipe = async (data: FormData) => {
  const recipeId = String(data.get("recipeId"));
  await deleteUserRecipe({ recipeId });
  redirect("/");
};

export const handleDeleteUserRecipes = async (_data: FormData) => {
  const email = await getEmail();
  const userId = await getUserIdByEmail({ email });
  await deleteUserRecipes({ userId });
  redirect("/");
};

export const handleGetRecipe = async (data: FormData) => {
  const recipe = await getRecipe({ id: String(data.get("recipeId")) });
  if (recipe) {
    const email = await getEmail();
    const userId = await getUserIdByEmail({ email });
    if (recipe.userId !== userId) {
      return undefined;
    }
  }
  return recipe;
};

export const handleGetMenu = async (data: FormData) => {
  return await getMenu({ id: String(data.get("id")) });
};

export const handleUpdateMenu = async (data: FormData) => {
  await updateMenu({
    id: String(data.get("id")),
    phoneticGuides: String(data.get("phoneticGuides")),
    name: String(data.get("name")),
    url: String(data.get("url")),
  });
  redirect("/");
};

export const handleDeleteMenu = async (data: FormData) => {
  await deleteMenu({ id: String(data.get("id")) });
  redirect("/");
};

const getEmail = async () => {
  const session = await getServerSession();
  return session?.user?.email || "";
};
