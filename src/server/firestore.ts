"use server";
import { Menu, Recipe } from "@/types";
import * as admin from "firebase-admin";

interface UserRecipe {
  id: number;
  menuId: number;
  userId: number;
  createdAt: String;
}

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
export const getUserIdByEmail = async (email: string) => {
  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();
  return doc.exists ? doc.data()?.id : 0;
};

export const getNewId = () => {
  const idNum = +new Date();
  const id = idNum.toString().slice(0, -3);
  return id;
};

/**
 * ユーザーレシピの取得
 * @param args
 * @returns
 */
export const getUserRecipe = async (args: { email: string }) => {
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
  menuId: number;
}) => {
  const userId = await getUserIdByEmail(args.email);
  const id = getNewId();
  const docRef = db
    .collection("recipes")
    .doc(id) as admin.firestore.DocumentReference<UserRecipe>;
  const data = {
    id: +id,
    userId: userId,
    menuId: args.menuId,
    createdAt: new Date().toString(),
  };
  await docRef.set(data);
  return data;
};

/**
 * ユーザーレシピの削除
 * @param args
 * @returns
 */
export const removeUserRecipe = async (args: { recipeId: number }) => {
  const { recipeId } = args;
  const docRef = db
    .collection("recipes")
    .doc(recipeId.toString()) as admin.firestore.DocumentReference<UserRecipe>;
  const res = (await docRef.get()).data();
  await docRef.delete();
  return res;
};

/**
 * メニューの追加・更新
 * @param args
 * @returns
 */
export const updateMenu = async (args: {
  id?: number;
  phoneticGuides?: string;
  name: string;
  url: string;
}) => {
  const { id, name, url, phoneticGuides } = args;
  const menuId = id ?? Number(getNewId());
  const docRef = db
    .collection("menus")
    .doc(menuId.toString()) as admin.firestore.DocumentReference<Menu>;
  const data = {
    id: menuId,
    name,
    phoneticGuides: phoneticGuides || name,
    url: url || "",
  };
  await docRef.set(data);
  return data;
};

/**
 * メニューの削除
 * @param args
 * @returns
 */
export const deleteMenu = async (args: { id: number }) => {
  const { id } = args;
  const docRef = db
    .collection("menus")
    .doc(id.toString()) as admin.firestore.DocumentReference<Menu>;
  const res = (await docRef.get()).data();
  await docRef.delete();
  return res;
};

/**
 * メニューの取得
 * @param args
 * @returns
 */
export const getMenu = async (args: { id: number }) => {
  const docRef = (await db
    .collection("menus")
    .doc(args.id.toString())) as admin.firestore.DocumentReference<Menu>;
  const data = (await docRef.get()).data();
  return data;
};

/**
 * メニューの一覧取得
 * @returns
 */
export const getMenus = async () => {
  const menus = await db.collection("menus").get();
  const buff: Menu[] = [];
  menus.forEach((menu) => buff.push(menu.data() as Menu));
  return buff;
};
