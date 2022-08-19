import { gql } from '@apollo/client'

export const GET_RECIPE = gql`
  query getRecipe($email: String!) {
    menus {
      id
      name
    }
    recipe(email: $email) {
      id
      data
    }
  }
`
