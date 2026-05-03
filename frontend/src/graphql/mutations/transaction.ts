import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($title: String!, $amount: Float!, $type: String!, $categoryId: String!, $date: String) {
    createTransaction(title: $title, amount: $amount, type: $type, categoryId: $categoryId, date: $date) {
      id
      title
      amount
      type
      categoryId
      createdAt
      date
      category {
        name
      }
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: String!, $title: String!, $amount: Float!, $type: String!, $date: String) {
    updateTransaction(id: $id, title: $title, amount: $amount, type: $type, date: $date) {
      id
      title
      amount
      type
      categoryId
      createdAt
      date
      category {
        name
      }
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id)
  }
`;
