import { ArrowDownCircle, ArrowUpCircle, ArrowDownRight, ArrowUpRight } from "lucide-react";

type TransactionRowProps = {
  title: string;
  date: string;
  category: string;
  amount: number;
  isIncome: boolean;
};

const transactionIconTone = {
  income: "bg-emerald-50 text-emerald-600",
  expense: "bg-rose-50 text-rose-600",
};

export function TransactionRow({ title, date, category, amount, isIncome }: TransactionRowProps) {
  const tone = isIncome ? transactionIconTone.income : transactionIconTone.expense;
  const sign = isIncome ? "+" : "-";

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone}`}>
        {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{date}</p>
      </div>

      <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
        {category}
      </div>

      <div className="flex items-center gap-2 text-right">
        <div>
          <p className="text-sm font-bold text-slate-900">
            {sign} {Math.abs(amount).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <p className="text-xs text-slate-400 sm:hidden">{category}</p>
        </div>
        {isIncome ? (
          <ArrowUpCircle size={18} className="text-emerald-600 shrink-0" />
        ) : (
          <ArrowDownCircle size={18} className="text-rose-600 shrink-0" />
        )}
      </div>
    </div>
  );
}