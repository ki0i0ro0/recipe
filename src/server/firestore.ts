import { Menu, Recipe } from "@/types";
import * as admin from "firebase-admin";
import crypto from "crypto";

interface DBRecipe extends Omit<Recipe, "id"> {}

interface DBMenu extends Omit<Menu, "id"> {}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // cert()の中に直接JSON形式で代入
      projectId: process.env.FSA_PROJECT_ID,
      privateKey: (process.env.FSA_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      clientEmail: process.env.FSA_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();

export const getUserIdByEmail = async (args: {
  email: string;
}): Promise<string> => {
  const userRef = db.collection("users").doc(args.email);
  const doc = await userRef.get();
  let userId = "";
  if (doc.exists) {
    userId = doc.data()!.id;
  } else {
    userId = crypto.randomUUID();
    await userRef.set({ id: userId });
  }
  return userId;
};

export const getRecipesByUserId = async (args: {
  userId: string;
}): Promise<Recipe[]> => {
  const userRecipes = await db
    .collection("recipes")
    .where("userId", "==", args.userId)
    .get();
  const buff: Recipe[] = [];
  userRecipes.forEach((userRecipe) =>
    buff.push({ ...userRecipe.data(), id: userRecipe.id } as Recipe),
  );
  return buff;
};

export const getRecipe = async (args: {
  id: string;
}): Promise<Recipe | undefined> => {
  const docRef = (await db
    .collection("recipes")
    .doc(args.id)) as admin.firestore.DocumentReference<DBRecipe>;
  const data = (await docRef.get()).data();
  return data ? { id: docRef.id, ...data } : undefined;
};

export const addUserRecipe = async (args: {
  userId: string;
  menuId: string;
}) => {
  const docRef = db
    .collection("recipes")
    .doc() as admin.firestore.DocumentReference<DBRecipe>;
  const data = {
    id: docRef.id,
    userId: args.userId,
    menuId: args.menuId,
    createdAt: new Date().toString(),
  };
  await docRef.set(data);
};

export const deleteUserRecipe = async (args: { recipeId: string }) => {
  await db.collection("recipes").doc(args.recipeId).delete();
};

export const deleteUserRecipes = async (args: { userId: string }) => {
  const recipes = await getRecipesByUserId({ userId: args.userId });
  for (const recipe of recipes) {
    await deleteUserRecipe({ recipeId: recipe.id });
  }
};

export const updateMenu = async (args: {
  id: string;
  phoneticGuides?: string;
  name: string;
  url: string;
}) => {
  const { id, name, url, phoneticGuides } = args;
  const docRef = id
    ? (db
        .collection("menus")
        .doc(id) as admin.firestore.DocumentReference<DBMenu>)
    : (db
        .collection("menus")
        .doc() as admin.firestore.DocumentReference<DBMenu>);
  const data = {
    name,
    phoneticGuides: phoneticGuides || name,
    url: url || "",
  };
  await docRef.set(data);
};

export const deleteMenu = async (args: { id: string }) => {
  const docRef = db
    .collection("menus")
    .doc(args.id) as admin.firestore.DocumentReference<Menu>;
  await docRef.delete();
};

export const getMenu = async (args: { id: string }): Promise<Menu> => {
  const docRef = (await db
    .collection("menus")
    .doc(args.id)) as admin.firestore.DocumentReference<DBMenu>;
  const data = (await docRef.get()).data();
  return { id: docRef.id, ...data! };
};

export const getMenus = async (): Promise<Menu[]> => {
  const menus = await db.collection("menus").get();
  const buff: Menu[] = [];
  menus.forEach((menu) => buff.push({ ...menu.data(), id: menu.id } as Menu));
  return buff;
};
