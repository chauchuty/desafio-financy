import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query {
    transactions {
      id
      title
      amount
      type
      createdAt
      date
      category {
        name
      }
    }
  }
`;