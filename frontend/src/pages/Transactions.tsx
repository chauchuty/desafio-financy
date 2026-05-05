import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@apollo/client/react";
import { ChevronLeft, ChevronRight, Plus, Search, PencilLine, Trash2, Filter, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import toast from "react-hot-toast";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction";
import { GET_CATEGORIES } from "../graphql/queries/categories";
import { ME } from "../graphql/queries/me";
import type { GetTransactionsResponse } from "../types/transaction";
import type { GetCategoriesResponse } from "../types/category";
import type { MeResponse } from "../types/user";
import type { Transaction } from "../types/transaction";
import { TransactionModal } from "../components/dashboard/TransactionModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import { AppHeader } from "../components/ui/AppHeader.tsx";
import { transactionService } from "../services";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) {
    return "Data inválida";
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Data inválida";
  }
  return dateFormatter.format(date);
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

function getTransactionTone(index: number) {
  return TRANSACTION_TONES[index % TRANSACTION_TONES.length];
}

export function Transactions() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const { data: transactionsData, loading: transactionsLoading, refetch: refetchTransactions } = useQuery<GetTransactionsResponse>(GET_TRANSACTIONS);
  const { data: categoriesData, loading: categoriesLoading } = useQuery<GetCategoriesResponse>(GET_CATEGORIES);
  const { data: meData, loading: meLoading } = useQuery<MeResponse>(ME);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [periodFilter, setPeriodFilter] = useState("Todos");
  const [page, setPage] = useState(1);

  const userName = meData?.me.name ?? "Usuário";

  const transactions = transactionsData?.transactions ?? [];
  const categories = categoriesData?.categories ?? [];

  const periodOptions = useMemo(() => {
    const monthOptions = new Set<string>();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      monthOptions.add(
        new Intl.DateTimeFormat("pt-BR", {
          month: "long",
          year: "numeric",
        })
          .format(date)
          .replace(/^./, (char) => char.toUpperCase()),
      );
    });

    return ["Todos", ...Array.from(monthOptions).sort((left, right) => right.localeCompare(left))];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        transaction.title.toLowerCase().includes(normalizedSearch) ||
        transaction.category?.name.toLowerCase().includes(normalizedSearch);

      const isIncome = isIncomeTransaction(transaction.type, transaction.amount);
      const matchesType =
        typeFilter === "Todos" ||
        (typeFilter === "Entrada" && isIncome) ||
        (typeFilter === "Saída" && !isIncome);

      const matchesCategory =
        categoryFilter === "Todas" || transaction.category?.name === categoryFilter;

      const transactionDate = new Date(transaction.createdAt);
      const isValidDate = !isNaN(transactionDate.getTime());
      
      const transactionPeriod = isValidDate
        ? new Intl.DateTimeFormat("pt-BR", {
            month: "long",
            year: "numeric",
          })
            .format(transactionDate)
            .replace(/^./, (char) => char.toUpperCase())
        : "";

      const matchesPeriod = periodFilter === "Todos" || transactionPeriod === periodFilter;

      return matchesSearch && matchesType && matchesCategory && matchesPeriod;
    });
  }, [categoryFilter, periodFilter, search, transactions, typeFilter]);

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      toast.success("Transação deletada com sucesso");
      await refetchTransactions();
    } catch {
      toast.error("Erro ao deletar transação");
    } finally {
      setTransactionToDelete(null);
    }
  };

  if (transactionsLoading || categoriesLoading || meLoading) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader activePage="transactions" userName={userName} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Transações</h1>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie todas as suas transações financeiras
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTransactionModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-700/20 transition hover:bg-emerald-800"
          >
            <Plus size={18} />
            Nova transação
          </button>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-4">
            <Field label="Buscar">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar por descrição"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </Field>

            <Field label="Tipo">
              <SelectField
                value={typeFilter}
                onChange={(value) => {
                  setTypeFilter(value);
                  setPage(1);
                }}
                options={["Todos", "Entrada", "Saída"]}
              />
            </Field>

            <Field label="Categoria">
              <SelectField
                value={categoryFilter}
                onChange={(value) => {
                  setCategoryFilter(value);
                  setPage(1);
                }}
                options={[
                  "Todas",
                  ...categories.map((category) => category.name),
                ]}
              />
            </Field>

            <Field label="Período">
              <SelectField
                value={periodFilter}
                onChange={(value) => {
                  setPeriodFilter(value);
                  setPage(1);
                }}
                options={periodOptions}
              />
            </Field>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50/70 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction, index) => {
                    const isIncome = isIncomeTransaction(transaction.type, transaction.amount);
                    const tone = getTransactionTone(index);

                    return (
                      <tr key={transaction.id} className="transition hover:bg-slate-50/80">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone.bg}`}>
                              <span className={`text-sm font-bold ${tone.fg}`}>
                                {transaction.title.slice(0, 1).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{transaction.title}</p>
                              <p className="text-sm text-slate-500 sm:hidden">
                                {formatDate(transaction.date || transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatDate(transaction.date || transaction.createdAt)}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {transaction.category?.name ?? "Sem categoria"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 text-sm font-semibold ${
                              isIncome ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {isIncome ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                            {isIncome ? "Entrada" : "Saída"}
                          </span>
                        </td>
                        <td className={`px-6 py-5 text-right text-sm font-bold ${isIncome ? "text-emerald-700" : "text-rose-700"}`}>
                          {isIncome ? "+" : "-"} {formatCurrency(Math.abs(transaction.amount))}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setTransactionToDelete(transaction)}
                              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                            >
                              <Trash2 size={16} className="text-rose-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(transaction)}
                              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700"
                            >
                              <PencilLine size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                      Nenhuma transação encontrada com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {filteredTransactions.length > 0 ? `1 a ${Math.min(safePage * itemsPerPage, filteredTransactions.length)} de ${filteredTransactions.length} resultados` : "0 resultados"}
            </p>

            <div className="flex items-center gap-2">
              <PagerButton onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1}>
                <ChevronLeft size={16} />
              </PagerButton>

              {Array.from({ length: totalPages }).slice(0, 3).map((_, index) => {
                const currentPage = index + 1;
                return (
                  <button
                    key={currentPage}
                    type="button"
                    onClick={() => setPage(currentPage)}
                    className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition ${
                      safePage === currentPage
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-slate-200 text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                    }`}
                  >
                    {currentPage}
                  </button>
                );
              })}

              <PagerButton onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage === totalPages}>
                <ChevronRight size={16} />
              </PagerButton>
            </div>
          </div>
        </section>
      </main>

      <TransactionModal
        open={isTransactionModalOpen}
        categories={categories}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />

      <ConfirmModal
        open={!!transactionToDelete}
        title="Deletar transação"
        description={
          transactionToDelete ? (
            <>
              Deseja realmente deletar a transação <strong>"{transactionToDelete.title}"</strong>? Essa ação não pode ser desfeita.
            </>
          ) : undefined
        }
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-500">
      <span>{label}</span>
      {children}
    </label>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[]; }) {
  return (
    <div className="relative">
      <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function PagerButton({ children, disabled, onClick }: { children: ReactNode; disabled?: boolean; onClick: () => void; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-20 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        <div className="mt-6 h-32 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        <div className="mt-6 h-[34rem] animate-pulse rounded-3xl border border-slate-200 bg-white" />
      </div>
    </div>
  );
}

const TRANSACTION_TONES = [
  { bg: "bg-blue-100", fg: "text-blue-600" },
  { bg: "bg-violet-100", fg: "text-violet-600" },
  { bg: "bg-orange-100", fg: "text-orange-600" },
  { bg: "bg-pink-100", fg: "text-pink-600" },
  { bg: "bg-emerald-100", fg: "text-emerald-600" },
];