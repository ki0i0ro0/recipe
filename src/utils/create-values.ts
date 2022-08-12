import { defaultValue } from '../config'
import { Recipe } from '../types'

export const createValues = (values?: Recipe): Recipe => {
  if (!values) return { ...defaultValue }
  return { ...values }
}
