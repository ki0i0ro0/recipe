import { gql } from "@apollo/client";

export const UPDATE_RECIPE = gql`
  mutation Mutation($id: Int!, $data: String) {
    updateRecipe(id: $id, data: $data) {
      id
    }
  }
`;
