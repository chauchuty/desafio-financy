import { client } from "../apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction";
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from "../graphql/mutations/transaction";

export interface Category {
  name: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  createdAt: string;
  date?: string;
  category: Category;
  categoryId?: string;
}

interface CreateTransactionPayload {
  title: string;
  amount: number;
  type: string;
  categoryId: string;
  date?: string;
}

interface UpdateTransactionPayload {
  id: string;
  title: string;
  amount: number;
  type: string;
  date?: string;
}

export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    const { data } = await client.query({
      query: GET_TRANSACTIONS,
    });
    return (data as any).transactions;
  },

  async createTransaction(
    payload: CreateTransactionPayload
  ): Promise<Transaction> {
    const { data } = await client.mutate({
      mutation: CREATE_TRANSACTION,
      variables: payload,
      refetchQueries: [{ query: GET_TRANSACTIONS }],
    });
    return (data as any).createTransaction;
  },

  async updateTransaction(
    payload: UpdateTransactionPayload
  ): Promise<Transaction> {
    const { data } = await client.mutate({
      mutation: UPDATE_TRANSACTION,
      variables: payload,
      refetchQueries: [{ query: GET_TRANSACTIONS }],
    });
    return (data as any).updateTransaction;
  },

  async deleteTransaction(id: string): Promise<boolean> {
    const { data } = await client.mutate({
      mutation: DELETE_TRANSACTION,
      variables: { id },
      refetchQueries: [{ query: GET_TRANSACTIONS }],
    });
    return (data as any).deleteTransaction;
  },
};
