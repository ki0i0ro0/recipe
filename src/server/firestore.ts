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
 * Get user's id by email address
 * @param email
 * @returns
 */
export const getUserId = async (email: string) => {
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
 * Get user recipe list by email address
 * @param args
 * @returns
 */
export const getRecipe = async (args: { email: string }) => {
  const userId = await getUserId(args.email);
  const userRecipes = await db
    .collection("recipes")
    .where("userId", "==", userId)
    .get();
  const buff: Recipe[] = [];
  userRecipes.forEach((userRecipe) => buff.push(userRecipe.data() as Recipe));
  return buff;
};

/**
 * Create user related menu
 * @param args
 * @returns
 */
export const addUserRecipe = async (args: {
  email: string;
  menuId: number;
}) => {
  const userId = await getUserId(args.email);
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
 * Delete user's one recipe
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
 * Create Menu
 * @param args
 * @returns
 */
export const createMenu = async (args: { name: string; url?: string }) => {
  const { name, url } = args;
  const id = getNewId();
  const docRef = db
    .collection("menus")
    .doc(id) as admin.firestore.DocumentReference<Menu>;
  const data = {
    id: +id,
    name,
    url: url || "",
  };
  await docRef.set(data);
  return data;
};

/**
 * Update Menu
 * @param args
 * @returns
 */
export const updateMenu = async (args: {
  id: number;
  name: string;
  url: string;
}) => {
  const { id, name, url } = args;
  const docRef = db
    .collection("menus")
    .doc(id.toString()) as admin.firestore.DocumentReference<Menu>;
  const data = {
    id,
    name,
    url: url || "",
  };
  await docRef.set(data);
  return data;
};

/**
 * Delete one menu
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
 * Get one menu
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
 * Get All Menu
 * @returns
 */
export const getMenus = async () => {
  const menus = await db.collection("menus").get();
  const buff: Menu[] = [];
  menus.forEach((menu) => buff.push(menu.data() as Menu));
  return buff;
};
