import { gql } from '@apollo/client'

export const GET_MENU = gql`
  query Menu($id: Int!) {
    menu(id: $id) {
      id
      name
    }
  }
`
