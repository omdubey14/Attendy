import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Topbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          {title || user?.name}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="relative rounded-2xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </button>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
};
