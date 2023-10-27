import { makeVar } from "@apollo/client";
import type { AppMenu } from "@/types";
// 現在のログイン情報を保持するリアクティブ変数。引数に初期値(false)を指定します。
export const userMenuState = makeVar({
  menuId: 0,
  menuName: "",
  createdAt: "",
  recipeId: 0,
} as AppMenu);
