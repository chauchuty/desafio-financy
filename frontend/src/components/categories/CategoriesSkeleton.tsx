export function CategoriesSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-16 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          <div className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          <div className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </div>
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}
