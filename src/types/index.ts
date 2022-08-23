export interface Recipe {
  id: number
  menu_id: number
  created_at: string
}

export interface Menu {
  id: number
  name: string
}

export interface GetRecipe {
  menus: Menu[]
  recipe: Recipe[]
}

export interface AppMenu {
  menuId: number
  menuName: string
  createdAt: string
  recipeId: number
}

export type Order = 'asc' | 'desc'
