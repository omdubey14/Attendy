import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getAdminReports } from "../../services/adminService";
import { formatDate } from "../../utils/formatters";

export const AdminReportsPage = () => {
  const { data, loading } = useAsync(getAdminReports, []);
  if (loading) return <Loader label="Loading reports..." />;

  const payload = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Reports overview"
        description="Review recent profiles, class activity, and announcements."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent announcements</h3>
          <div className="mt-4 space-y-3">
            {payload.announcements.map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                <p className="mt-3 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent student profiles</h3>
          <div className="mt-4 space-y-3">
            {payload.recentStudentProfiles.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {item.admissionNumber} • Class {item.className}-{item.section}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Guardian: {item.guardianName || "Not set"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
