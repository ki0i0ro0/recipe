"use server";
import {
  addUserRecipe,
  deleteMenu,
  getMenus,
  getUserRecipe,
  removeUserRecipe,
  updateMenu,
} from "@/server/firestore";
import { AppMenu } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const getCookedMenu = async () => {
  const recipe = await getUserRecipe({ email: await getEmail() });
  const menus = await getMenus();
  const cookedMenus: AppMenu[] = menus.map((menu) => {
    const cookedMenu = recipe.find(
      (userMenu) => userMenu.menuId.toString() === menu.id,
    );
    return {
      menuId: menu.id,
      menuName: menu.name,
      menuPhoneticGuides: menu.phoneticGuides,
      createdAt: cookedMenu?.createdAt || "",
      recipeId: cookedMenu?.id || "",
    };
  });
  return cookedMenus;
};

export const handleAddUserRecipe = async (data: FormData) => {
  const menuId = String(data.get("menuId"));
  await addUserRecipe({ email: await getEmail(), menuId });
  redirect("/");
};

export const handleDeleteUserRecipe = async (data: FormData) => {
  const recipeId = String(data.get("recipeId"));
  await removeUserRecipe({ recipeId });
  redirect("/");
};

/**
 * メニューの追加・更新
 * @param data
 */
export const handleUpdateMenu = async (data: FormData) => {
  await updateMenu({
    id: String(data.get("id")),
    phoneticGuides: String(data.get("phoneticGuides") ?? ""),
    name: String(data.get("name")),
    url: String(data.get("url")),
  });
  redirect("/");
};
/**
 * メニューの削除
 * @param data
 */
export const handleDeleteMenu = async (data: FormData) => {
  await deleteMenu({ id: String(data.get("id")) });
  redirect("/");
};

const getEmail = async () => {
  const session = await getServerSession();
  return session?.user?.email || "";
};
