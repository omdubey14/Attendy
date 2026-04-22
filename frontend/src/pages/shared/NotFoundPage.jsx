import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="page-shell flex min-h-screen items-center justify-center p-6">
    <div className="card max-w-lg text-center">
      <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Go home
      </Link>
    </div>
  </div>
);
