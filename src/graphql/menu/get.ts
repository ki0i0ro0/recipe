import { gql } from '@apollo/client'

import type { Menu } from '@/types'

export interface DataMenu {
  menu: Menu
}

export const GET_MENU = gql`
  query Menu($id: Int!) {
    menu(id: $id) {
      id
      name
      url
    }
  }
`
