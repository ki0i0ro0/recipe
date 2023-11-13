export interface Recipe {
  id: number;
  menuId: number;
  createdAt: string;
}

export interface Menu {
  id: number;
  name: string;
  phoneticGuides?: string;
  url: string;
}

export interface GetRecipe {
  menus: Menu[];
  recipe: Recipe[];
}

export interface AppMenu {
  menuId: number;
  menuName: string;
  menuPhoneticGuides?: string;
  createdAt: string;
  recipeId: number;
  url?: string;
}

export type Order = "asc" | "desc";
