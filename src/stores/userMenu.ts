import { atom } from 'recoil'
import type { AppMenu } from '@/types'

export const userMenuState = atom({
  key: 'userMenu',
  default: {
    menuId: 0,
    menuName: '',
    createdAt: '',
    recipeId: 0,
  } as AppMenu,
})
