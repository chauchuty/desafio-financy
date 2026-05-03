import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction";
import { GET_CATEGORIES } from "../graphql/queries/categories";
import { ME } from "../graphql/queries/me";
import type { GetTransactionsResponse } from "../types/transaction";
import type { GetCategoriesResponse } from "../types/category";
import type { MeResponse } from "../types/user";
import { StatCard } from "../components/dashboard/StatCard";
import { TransactionRow } from "../components/dashboard/TransactionRow";
import { CategoryRow } from "../components/dashboard/CategoryRow";
import { TransactionModal } from "../components/dashboard/TransactionModal";
import {
  BarChart3,
  ChevronRight,
  Repeat2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function isIncomeTransaction(type: string, amount: number) {
  const normalized = type.trim().toLowerCase();

  if (["income", "entrada", "receita", "credit"].includes(normalized)) {
    return true;
  }

  if (["expense", "despesa", "saida", "saída", "debit"].includes(normalized)) {
    return false;
  }

  return amount >= 0;
}

function getInitials(name?: string) {
  if (!name) {
    return "CT";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Dashboard() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const { data: transactionsData, loading: transactionsLoading } = useQuery<GetTransactionsResponse>(GET_TRANSACTIONS);
  const { data: categoriesData, loading: categoriesLoading } = useQuery<GetCategoriesResponse>(GET_CATEGORIES);
  const { data: meData, loading: meLoading } = useQuery<MeResponse>(ME);

  const transactions = transactionsData?.transactions ?? [];
  const categories = categoriesData?.categories ?? [];

  const incomeTotal = transactions
    .filter((transaction) => isIncomeTransaction(transaction.type, transaction.amount))
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenseTotal = transactions
    .filter((transaction) => !isIncomeTransaction(transaction.type, transaction.amount))
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

  const balanceTotal = incomeTotal - expenseTotal;

  const recentTransactions = [...transactions]
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
    .slice(0, 5);

  const categorySummary = categories.map((category, index) => {
    const relatedTransactions = transactions.filter(
      (transaction) => transaction.category?.name === category.name,
    );

    const total = relatedTransactions.reduce(
      (sum, transaction) => sum + Math.abs(transaction.amount),
      0,
    );

    return {
      ...category,
      count: relatedTransactions.length,
      total,
      tone: CATEGORY_TONES[index % CATEGORY_TONES.length],
    };
  });

  if (transactionsLoading || categoriesLoading || meLoading) {
    return <DashboardSkeleton />;
  }

  const userName = meData?.me.name ?? "Usuário";
  const userInitials = getInitials(userName);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-700">
                Financy
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <span className="flex items-center gap-2 text-emerald-700">
              Dashboard
            </span>
            <Link className="transition-colors hover:text-slate-800" to="/transactions">
              Transações
            </Link>
            <Link className="transition-colors hover:text-slate-800" to="/categories">
              Categorias
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
              {userInitials}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Saldo total"
            value={formatCurrency(balanceTotal)}
            icon={<BarChart3 size={18} />}
            accentClassName="bg-violet-50 text-violet-600"
          />
          <StatCard
            title="Receitas do mês"
            value={formatCurrency(incomeTotal)}
            icon={<TrendingUp size={18} />}
            accentClassName="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Despesas do mês"
            value={formatCurrency(expenseTotal)}
            icon={<TrendingDown size={18} />}
            accentClassName="bg-rose-50 text-rose-600"
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Transações recentes
                </p>
              </div>

              <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
                Ver todas <ChevronRight size={16} />
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => {
                  const dateToUse = transaction.date || transaction.createdAt;
                  const transactionDate = new Date(dateToUse);
                  const formattedDate = isNaN(transactionDate.getTime())
                    ? "Data inválida"
                    : transactionDate.toLocaleDateString("pt-BR");

                  return (
                    <TransactionRow
                      key={transaction.id}
                      title={transaction.title}
                      date={formattedDate}
                      category={transaction.category?.name ?? "Sem categoria"}
                      amount={transaction.amount}
                      isIncome={isIncomeTransaction(transaction.type, transaction.amount)}
                    />
                  );
                })
              ) : (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  Nenhuma transação encontrada.
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-4 text-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                onClick={() => setIsTransactionModalOpen(true)}
              >
                <Repeat2 size={16} />
                Nova transação
              </button>
            </div>
          </article>

          <aside className="space-y-6">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Categorias
                  </p>
               
                </div>

                <Link to="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
                  Gerenciar <ChevronRight size={16} />
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {categorySummary.length > 0 ? (
                  categorySummary.map((category) => (
                    <CategoryRow
                      key={category.id}
                      name={category.name}
                      count={category.count}
                      total={category.total}
                      tone={category.tone}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                    Nenhuma categoria cadastrada.
                  </div>
                )}
              </div>
            </article>
          </aside>
        </section>
      </main>

      <TransactionModal
        open={isTransactionModalOpen}
        categories={categories}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
}

const CATEGORY_TONES = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-amber-100 text-amber-700",
];

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-16 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          <div className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          <div className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="h-[32rem] animate-pulse rounded-3xl border border-slate-200 bg-white" />
          <div className="h-[32rem] animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}