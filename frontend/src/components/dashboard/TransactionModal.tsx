import { useEffect, useState, type ReactNode } from "react";
import { useMutation } from "@apollo/client/react";
import { X } from "lucide-react";
import type { Category } from "../../types/category";
import type { Transaction } from "../../types/transaction";
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "../../graphql/mutations/transaction";
import { GET_TRANSACTIONS } from "../../graphql/queries/transaction";

type TransactionModalProps = {
  open: boolean;
  categories: Category[];
  onClose: () => void;
  transaction?: Transaction | null;
};

type TransactionType = "expense" | "income";

export function TransactionModal({ open, categories, onClose, transaction }: TransactionModalProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>("expense");
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [createTransaction, { loading: createLoading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS }],
  });

  const [updateTransaction, { loading: updateLoading }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS }],
  });

  const loading = createLoading || updateLoading;

  useEffect(() => {
    if (!open) {
      setTransactionType("expense");
      setSubmitted(false);
      setTitle("");
      setDate("");
      setAmount("");
      setCategoryId("");
    } else if (transaction) {
      const isIncome = transaction.type.toLowerCase().includes("income") || transaction.type.toLowerCase().includes("entrada");
      setTransactionType(isIncome ? "income" : "expense");
      setTitle(transaction.title);
      setDate(transaction.date || transaction.createdAt.split("T")[0]);
      setAmount(Math.abs(transaction.amount).toString());
      setCategoryId(transaction.category?.id || "");
    } else {
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [open, transaction]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const titleError = submitted && !title.trim();
  const dateError = submitted && !date;
  const amountError = submitted && !amount.trim();
  const categoryError = submitted && !categoryId;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);

    if (!title.trim() || !date || !amount.trim() || !categoryId) {
      return;
    }

    if (transaction) {
      updateTransaction({
        variables: {
          id: transaction.id,
          title: title.trim(),
          amount: parseFloat(amount),
          type: transactionType,
          date: date,
        },
      }).then(() => {
        onClose();
      });
    } else {
      createTransaction({
        variables: {
          title: title.trim(),
          amount: parseFloat(amount),
          type: transactionType,
          categoryId,
          date: date,
        },
      }).then(() => {
        onClose();
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-8 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {transaction ? "Editar transação" : "Nova transação"}
            </h2>
            <p className="text-sm text-slate-500">
              {transaction ? "Atualize os dados da transação" : "Registre sua despesa ou receita"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setTransactionType("expense")}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                transactionType === "expense"
                  ? "border border-rose-500 bg-rose-50 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className={`grid h-5 w-5 place-items-center rounded-full ${transactionType === "expense" ? "text-rose-500" : "text-slate-400"}`}>
                ⦿
              </span>
              Despesa
            </button>

            <button
              type="button"
              onClick={() => setTransactionType("income")}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                transactionType === "income"
                  ? "border border-emerald-500 bg-emerald-50 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className={`grid h-5 w-5 place-items-center rounded-full ${transactionType === "income" ? "text-emerald-500" : "text-slate-400"}`}>
                ⦿
              </span>
              Receita
            </button>
          </div>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit}
        >
          <Field label="Descrição">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex. Almoço no restaurante"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                titleError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
              }`}
            />
            {titleError ? <ErrorText>Informe a descrição.</ErrorText> : null}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data">
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                  dateError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {dateError ? <ErrorText>Informe a data.</ErrorText> : null}
            </Field>

            <Field label="Valor">
              <div
                className={`flex items-center rounded-xl border px-4 py-3 text-sm text-slate-700 focus-within:ring-2 ${
                  amountError
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-emerald-100"
                }`}
              >
                <span className={`mr-2 ${amountError ? "text-red-400" : "text-slate-400"}`}>R$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full border-0 p-0 text-sm outline-none placeholder:text-slate-400 focus:ring-0"
                />
              </div>
              {amountError ? <ErrorText>Informe o valor.</ErrorText> : null}
            </Field>
          </div>

          <Field label="Categoria">
            <select
              disabled={!!transaction}
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 ${
                categoryError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
              }`}
            >
              <option value="">Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoryError ? <ErrorText>Selecione uma categoria.</ErrorText> : null}
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (transaction ? "Atualizando..." : "Salvando...") : (transaction ? "Salvar alterações" : "Salvar")}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium text-red-500">{children}</p>;
}