export interface Recipe {
  id: string;
  menuId: string;
  createdAt: string;
}

export interface Menu {
  id: string;
  name: string;
  phoneticGuides?: string;
  url: string;
}

export interface GetRecipe {
  menus: Menu[];
  recipe: Recipe[];
}

export interface AppMenu {
  menuId: string;
  menuName: string;
  menuPhoneticGuides?: string;
  createdAt: string;
  recipeId: string;
  url?: string;
}

export type Order = "asc" | "desc";
