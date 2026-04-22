export const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);
