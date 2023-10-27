import { gql } from "@apollo/client";

export const DELETE_MENU = gql`
  mutation Mutation($id: Int!) {
    deleteMenu(id: $id) {
      id
    }
  }
`;
