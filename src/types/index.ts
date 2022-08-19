export interface Recipe {
  id: number
  data: string
}

export interface DecodedRecipe {
  id: number
  data: RecipeData[]
}

export interface RecipeData {
  menuId: string
  date: string
}

export interface Menu {
  id: number
  name: string
}

export interface GetRecipe {
  menus: Menu[]
  recipe: Recipe
}

export interface AppMenu {
  id: number
  name: string
  date: string
}

export type Order = 'asc' | 'desc'
