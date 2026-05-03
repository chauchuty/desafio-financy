import { gql } from "apollo-server";
import { GraphQLScalarType } from "graphql";

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Category {
    id: ID!
    name: String!
    description: String!
    color: String!
    icon: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    categoryId: String!
    createdAt: DateTime!
    date: DateTime
    category: Category!
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

    createCategory(name: String!, description: String, color: String, icon: String): Category!
    updateCategory(id: String!, name: String!, description: String, color: String, icon: String): Category!
    deleteCategory(id: String!): Boolean!

    createTransaction(
      title: String!
      amount: Float!
      type: String!
      categoryId: String!
      date: String
    ): Transaction!

    updateTransaction(
      id: String!
      title: String!
      amount: Float!
      type: String!
      date: String
    ): Transaction!

    deleteTransaction(id: String!): Boolean!
  }
`;

export const dateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime custom scalar type",
  serialize: (value: any) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === "string") {
      return value;
    }
    throw new Error(`Cannot serialize ${typeof value} as DateTime`);
  },
  parseValue: (value: any) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    throw new Error(`Cannot parse ${typeof value} as DateTime`);
  },
  parseLiteral: (ast: any) => {
    if (ast.kind === 3) { // StringValue
      return new Date(ast.value);
    }
    throw new Error(`Cannot parse ${ast.kind} as DateTime`);
  },
});