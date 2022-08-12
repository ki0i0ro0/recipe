import { defaultValue } from '@/config'
import { axios } from '@/lib/axios'
import { Recipe } from '@/types'

export const setUserId = (userId: string) => {}

export const getAll = async () => {
  axios.post('').then((res) => {
    return res.data as Recipe[]
  })
  return [] as Recipe[]
}

export const get = async () => {
  return defaultValue as Recipe
}

export const create = async () => {}

export const update = async () => {}

export const remove = async () => {}
