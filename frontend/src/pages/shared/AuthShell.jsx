import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export const AuthShell = ({ title, subtitle, children, footerText, footerLink, footerAction }) => (
  <div className="page-shell flex min-h-screen items-center justify-center p-4">
    <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-soft backdrop-blur dark:bg-slate-950/70 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden flex-col justify-between bg-slate-950 p-10 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-500/20 p-3 text-sky-300">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">EduPulse SMS</h1>
              <p className="text-sm text-slate-400">Modern school administration platform</p>
            </div>
          </div>
          <h2 className="mt-16 max-w-md font-display text-4xl font-bold leading-tight">
            Run admissions, attendance, marks, and announcements from one dashboard.
          </h2>
          <p className="mt-6 max-w-lg text-sm text-slate-400">
            Built for schools and colleges with secure role-based access, real-time updates, and clean analytics.
          </p>
        </div>
         {/* <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Demo access</p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>Admin: admin@sms.com / admin123</p>
            <p>Teacher: teacher@sms.com / teacher123</p>
            <p>Student: student1@sms.com / student123</p>
          </div> 
        </div> */}
      </div>

      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-md">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            {footerText}{" "}
            <Link to={footerLink} className="font-semibold text-sky-500">
              {footerAction}
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);
