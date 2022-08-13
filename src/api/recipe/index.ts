import { defaultValue } from '@/config'
import { axios } from '@/lib/axios'
import type { Recipe } from '@/types'

export const setUserId = (userId: string) => {}

export const getAll = async () => {
  axios.post('').then((res) => {
    return res.data as Recipe[]
  })
  return [] as Recipe[]
}

export const create = async (value: Recipe) => {}
