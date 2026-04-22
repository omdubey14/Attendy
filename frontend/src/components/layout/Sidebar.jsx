import { NavLink } from "react-router-dom";
import { GraduationCap, LogOut, Moon, Sun } from "lucide-react";
import { navigationByRole } from "../../utils/navigation";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const items = navigationByRole[user?.role] || [];

  return (
    <aside className="flex h-full w-full flex-col rounded-[2rem] border border-white/20 bg-slate-950 px-5 py-6 text-white shadow-soft">
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="rounded-2xl bg-sky-500/20 p-3 text-sky-300">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">Attendy</h2>
          <p className="text-xs text-slate-400">School operations suite</p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${user?.role}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                  isActive ? "bg-white text-slate-900" : "text-slate-300 hover:bg-white/10"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/10 pt-6">
        <button type="button" onClick={toggleTheme} className="btn-secondary w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10">
          {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button type="button" onClick={logout} className="btn-secondary w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
};
