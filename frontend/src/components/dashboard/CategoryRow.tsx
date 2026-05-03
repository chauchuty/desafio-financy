const TONE_MAP: Record<string, string> = {
  "bg-blue-100 text-blue-700": "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700": "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700": "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700": "bg-pink-100 text-pink-700",
  "bg-amber-100 text-amber-700": "bg-amber-100 text-amber-700",
};

type CategoryRowProps = {
  name: string;
  count: number;
  total: number;
  tone: string;
};

export function CategoryRow({ name, count, total, tone }: CategoryRowProps) {
  const resolvedTone = TONE_MAP[tone] || tone;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100/80">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`h-10 rounded-full px-3 text-sm font-semibold leading-10 ${resolvedTone}`}>
          {name}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4 text-right">
        <div className="text-sm text-slate-500">
          {count} item{count === 1 ? "" : "s"}
        </div>
        <p className="text-sm font-bold text-slate-900">
          {total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>
    </div>
  );
}