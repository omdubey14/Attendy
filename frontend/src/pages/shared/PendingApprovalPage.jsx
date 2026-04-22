import { Link } from "react-router-dom";

export const PendingApprovalPage = () => (
  <div className="page-shell flex min-h-screen items-center justify-center p-6">
    <div className="card max-w-xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
        Approval pending
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">
        Your account is waiting for admin review
      </h1>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Once an administrator approves your registration, you will be able to access the full portal.
      </p>
      <Link to="/login" className="btn-primary mt-8">
        Back to login
      </Link>
    </div>
  </div>
);
