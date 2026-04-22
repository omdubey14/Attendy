import { motion } from "framer-motion";

const accentClasses = {
  sky: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
};

export const StatCard = ({ label, value, icon: Icon, accent = "sky" }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="card overflow-hidden"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`rounded-2xl p-3 ${accentClasses[accent] || accentClasses.sky}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </motion.div>
);
