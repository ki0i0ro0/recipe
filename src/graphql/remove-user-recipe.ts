import { gql } from '@apollo/client'

export const REMOVE_USER_RECIPE = gql`
  mutation RemoveUserRecipe($email: String!, $recipeId: Int!) {
    removeUserRecipe(email: $email, recipeId: $recipeId) {
      id
    }
  }
`
