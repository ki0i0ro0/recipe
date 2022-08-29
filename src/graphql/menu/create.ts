import { gql } from '@apollo/client'

export const CREATE_MENU = gql`
  mutation Mutation($name: String!, $url: String!) {
    createMenu(name: $name, url: $url) {
      id
    }
  }
`
