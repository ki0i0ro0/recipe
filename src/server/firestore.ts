"use server";
import { Menu, Recipe } from "@/types";
import * as admin from "firebase-admin";
import crypto from "crypto";

interface UserRecipe {
  id: string;
  menuId: string;
  userId: string;
  createdAt: string;
}

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

/**
 * メールアドレスからユーザーIDを取得
 * @param email
 * @returns
 */
export const getUserIdByEmail = async (email: string): Promise<string> => {
  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();
  let userId = "";
  if (doc.exists) {
    userId = doc.data()!.id;
  } else {
    const newUserRef = db.collection("users").doc(email);
    userId = crypto.randomUUID();
    await newUserRef.set({ id: userId });
  }
  return userId;
};

/**
 * ユーザーレシピの取得
 * @param args
 * @returns
 */
export const getUserRecipe = async (args: {
  email: string;
}): Promise<Recipe[]> => {
  const userId = await getUserIdByEmail(args.email);
  const userRecipes = await db
    .collection("recipes")
    .where("userId", "==", userId)
    .get();
  const buff: Recipe[] = [];
  userRecipes.forEach((userRecipe) => buff.push(userRecipe.data() as Recipe));
  return buff;
};

/**
 * ユーザーレシピの追加
 * @param args
 * @returns
 */
export const addUserRecipe = async (args: {
  email: string;
  menuId: string;
}) => {
  const userId = await getUserIdByEmail(args.email);
  const docRef = db
    .collection("recipes")
    .doc() as admin.firestore.DocumentReference<UserRecipe>;
  const data = {
    id: docRef.id,
    userId: userId,
    menuId: args.menuId,
    createdAt: new Date().toString(),
  };
  await docRef.set(data);
};

/**
 * ユーザーレシピの削除
 * @param args
 * @returns
 */
export const removeUserRecipe = async (args: { recipeId: string }) => {
  const docRef = db
    .collection("recipes")
    .doc(args.recipeId) as admin.firestore.DocumentReference<UserRecipe>;
  await docRef.delete();
};

/**
 * メニューの追加・更新
 * @param args
 * @returns
 */
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

/**
 * メニューの削除
 * @param args
 * @returns
 */
export const deleteMenu = async (args: { id: string }) => {
  const docRef = db
    .collection("menus")
    .doc(args.id) as admin.firestore.DocumentReference<Menu>;
  await docRef.delete();
};

/**
 * メニューの取得
 * @param args
 * @returns
 */
export const getMenu = async (args: { id: string }): Promise<Menu> => {
  const docRef = (await db
    .collection("menus")
    .doc(args.id)) as admin.firestore.DocumentReference<DBMenu>;
  const data = (await docRef.get()).data();
  return { id: docRef.id, ...data! };
};

/**
 * メニューの一覧取得
 * @returns
 */
export const getMenus = async (): Promise<Menu[]> => {
  const menus = await db.collection("menus").get();
  const buff: Menu[] = [];
  menus.forEach((menu) => buff.push({ id: menu.id, ...menu.data() } as Menu));
  return buff;
};
