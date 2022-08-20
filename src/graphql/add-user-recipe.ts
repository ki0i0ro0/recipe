import { gql } from '@apollo/client'

export const ADD_USER_RECIPE = gql`
  mutation AddUserRecipe($email: String!, $menuId: Int!) {
    addUserRecipe(email: $email, menuId: $menuId) {
      id
      menu_id
    }
  }
`
