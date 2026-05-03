import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $description: String, $color: String, $icon: String) {
    createCategory(name: $name, description: $description, color: $color, icon: $icon) {
      id
      name
      description
      color
      icon
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $name: String!, $description: String, $color: String, $icon: String) {
    updateCategory(id: $id, name: $name, description: $description, color: $color, icon: $icon) {
      id
      name
      description
      color
      icon
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;