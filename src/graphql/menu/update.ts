import { gql } from '@apollo/client'

export const UPDATE_MENU = gql`
  mutation Mutation($id: Int!, $name: String!, $url: String) {
    updateMenu(id: $id, name: $name, url: $url) {
      id
    }
  }
`
