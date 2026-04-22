export const EmptyState = ({ title, description }) => (
  <div className="card flex min-h-[200px] flex-col items-center justify-center text-center">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
  </div>
);
