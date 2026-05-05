import { Tag, Trash2, PencilLine } from "lucide-react";
import { CATEGORY_COLOR_TONES } from "./categoriesUtils";

export type CategoryCardData = {
  id: string;
  name: string;
  description: string;
  icon: typeof Tag;
  iconId: string;
  color: string;
  tone: string;
  count: number;
  total: number;
};

type CategoryCardProps = {
  data: CategoryCardData;
  onEdit: () => void;
  onDelete?: () => void;
};

export function CategoryCard({ data, onEdit, onDelete }: CategoryCardProps) {
  const Icon = data.icon;
  const colorTone = CATEGORY_COLOR_TONES[data.color] ?? data.tone;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/50">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${colorTone}`}>
          <Icon size={20} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDelete?.()}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
          >
            <Trash2 size={16} className="text-rose-600" />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700"
          >
            <PencilLine size={16} />
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900">{data.name}</h2>
      <p className="mt-1 text-sm text-slate-500">{data.description}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorTone}`}>Categoria</span>
        <p className="text-sm font-semibold text-slate-700">{data.count} itens</p>
      </div>
    </article>
  );
}
