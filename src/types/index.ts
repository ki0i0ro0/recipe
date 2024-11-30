export interface Recipe {
  id: string;
  menuId: string;
  userId: string;
  createdAt: string;
  histories?: string[];
}

export interface Menu {
  id: string;
  name: string;
  phoneticGuides?: string;
  url: string;
}

export interface AppMenu {
  menuId: string;
  menuName: string;
  menuPhoneticGuides?: string;
  createdAt?: string;
  recipeId: string;
  url?: string;
  cookedCount?: number;
}

export type Order = "asc" | "desc";
