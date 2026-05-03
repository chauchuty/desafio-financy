import { type ReactNode } from "react";

type SummaryHighlightProps = {
  icon: ReactNode;
  title: string;
  value: string;
};

export function SummaryHighlight({ icon, title, value }: SummaryHighlightProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
      <div className="flex items-center justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">{icon}</div>
        <div>
          <p className="mt-1 text-2xl font-black tracking-tight text-slate-900 mb-2">{value}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</p>
        </div>
      </div>
    </article>
  );
}
