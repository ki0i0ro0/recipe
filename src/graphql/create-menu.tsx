import { gql } from '@apollo/client'

export const CREATE_MENU = gql`
  mutation Mutation($name: String!) {
    createMenu(name: $name) {
      id
      name
    }
  }
`
