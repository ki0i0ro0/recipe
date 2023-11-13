"use server";
import {
  addUserRecipe,
  createMenu,
  deleteMenu,
  getMenus,
  getRecipe,
  removeUserRecipe,
  updateMenu,
} from "@/server/firestore";
import { AppMenu } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const getRecipeMenu = async () => {
  const recipe = await getRecipe({ email: await getEmail() });
  const menus = await getMenus();
  return { recipe, menus };
};

export const getCookedMenu = async () => {
  const data = await getRecipeMenu();
  const cookedMenus: AppMenu[] = data?.menus.map((menu) => {
    const cookedMenu = data?.recipe.find(
      (userMenu) => userMenu.menuId === menu.id,
    );
    return {
      menuId: menu.id ?? 0,
      menuName: menu.name,
      createdAt: cookedMenu?.createdAt || "",
      recipeId: cookedMenu?.id ?? 0,
    };
  });
  return cookedMenus;
};

export const handleAddUserRecipe = async (data: FormData) => {
  const menuId = Number(data.get("menuId") ?? 0);
  await addUserRecipe({ email: await getEmail(), menuId });
  redirect("/");
};

export const handleDeleteUserRecipe = async (data: FormData) => {
  const recipeId = Number(data.get("recipeId") ?? 0);
  await removeUserRecipe({ recipeId });
  redirect("/");
};

export const handleCreateMenu = async (data: FormData) => {
  await createMenu({
    name: String(data.get("name") ?? ""),
    url: String(data.get("url") ?? ""),
  });
  redirect("/");
};

export const handleUpdateMenu = async (data: FormData) => {
  await updateMenu({
    id: Number(data.get("id") ?? 0),
    name: String(data.get("name") ?? ""),
    url: String(data.get("url") ?? ""),
  });
  redirect("/");
};

export const handleDeleteMenu = async (data: FormData) => {
  await deleteMenu({ id: Number(data.get("id") ?? 0) });
  redirect("/");
};

const getEmail = async () => {
  const session = await getServerSession();
  return session?.user?.email || "";
};
