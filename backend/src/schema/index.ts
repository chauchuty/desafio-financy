import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    categoryId: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    categories: [Category!]!
    transactions: [Transaction!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    createCategory(name: String!): Category!
    updateCategory(id: String!, name: String!): Category!
    deleteCategory(id: String!): Boolean!

    createTransaction(
      title: String!
      amount: Float!
      type: String!
      categoryId: String!
    ): Transaction!

    updateTransaction(
      id: String!
      title: String!
      amount: Float!
      type: String!
    ): Transaction!

    deleteTransaction(id: String!): Boolean!
  }
`;