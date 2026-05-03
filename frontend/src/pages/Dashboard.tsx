import { useQuery } from "@apollo/client/react";
import { GET_TRANSACTIONS } from "./../graphql/queries/transaction";
import type { GetTransactionsResponse } from "../types/transaction";

export function Dashboard() {
  const { data, loading } = useQuery<GetTransactionsResponse>(GET_TRANSACTIONS);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      {data?.transactions.map((t: any) => (
        <div key={t.id}>
          <p>{t.title}</p>
          <p>{t.amount}</p>
          <p>{t.category?.name}</p>
        </div>
      ))}
    </div>
  );
}