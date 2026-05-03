export type Category = {
  id: string;
  name: string;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: string;
  createdAt: string;
  date?: string;
  category?: Category;
};

export type GetTransactionsResponse = {
  transactions: Transaction[];
};