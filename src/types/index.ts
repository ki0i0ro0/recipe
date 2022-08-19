export interface Recipe {
  id?: number
  data: string
}

export interface Menu {
  id?: number
  name: string
}

export type Order = 'asc' | 'desc'
