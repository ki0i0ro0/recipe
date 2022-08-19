export interface Recipe {
  id?: number
  data: string
}

export interface DecodedRecipe {
  id: number
  data: RecipeData[]
}

export interface RecipeData {
  menuId: number
  date: Date
}

export interface Menu {
  id?: number
  name: string
}

export interface GetRecipe {
  menus: Menu[]
  recipe: Recipe
}

export interface AppMenu {
  id?: number
  name: string
  date: Date | undefined
}

export type Order = 'asc' | 'desc'
