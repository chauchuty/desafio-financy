import { gql } from "graphql-tag";

export const UPDATE_USER = gql`
  mutation UpdateUser($name: String!, $email: String!, $password: String) {
    updateUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;
