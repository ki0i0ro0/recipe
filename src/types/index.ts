export type BaseEntity = {
  id: string
  createdAt: number
}

export interface BaseType {
  id: number
  updatedAt: Date
}

export interface Recipe extends BaseType {
  name: string
}

export type Order = 'asc' | 'desc'
