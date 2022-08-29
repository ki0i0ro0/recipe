import { gql } from '@apollo/client'

export const GET_RECIPE = gql`
  query getRecipe($email: String!) {
    menus {
      id
      name
      url
    }
    recipe(email: $email) {
      id
      menu_id
      created_at
    }
  }
`
