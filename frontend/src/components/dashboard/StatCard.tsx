import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  accentClassName: string;
};

export function StatCard({ title, value, icon, accentClassName }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accentClassName}`}>
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-black tracking-tight text-slate-600">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}