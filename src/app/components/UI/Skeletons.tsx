export function SectionSkeleton({ cols = 3 }: { cols?: number }) {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="h-10 w-72 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
          <div className="h-5 w-80 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>

        {/* Card grid skeleton */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""} gap-8`}
        >
          {Array.from({ length: cols }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 overflow-hidden"
            >
              <div className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
          <div className="h-5 w-80 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="space-y-2 pt-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="h-10 w-72 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
          <div className="h-5 w-80 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
