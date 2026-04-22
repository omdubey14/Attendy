import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getStudentAttendance } from "../../services/studentService";
import { formatDate } from "../../utils/formatters";

export const StudentAttendancePage = () => {
  const { data, loading } = useAsync(getStudentAttendance, []);
  if (loading) return <Loader label="Loading attendance..." />;

  const attendance = data?.data || [];
  const summary = data?.meta?.summary;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Panel"
        title="Attendance history"
        description="Review your daily attendance with subject-wise updates."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500 dark:text-slate-400">Present</p>
          <p className="mt-2 text-3xl font-bold text-emerald-500">{summary?.present || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500 dark:text-slate-400">Absent</p>
          <p className="mt-2 text-3xl font-bold text-rose-500">{summary?.absent || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500 dark:text-slate-400">Late</p>
          <p className="mt-2 text-3xl font-bold text-amber-500">{summary?.late || 0}</p>
        </div>
      </div>

      {attendance.length === 0 ? (
        <EmptyState title="No attendance records yet" description="Your teacher will publish attendance here." />
      ) : (
        <div className="card overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3">Date</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Class</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((item) => (
                <tr key={item._id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-4">{formatDate(item.date)}</td>
                  <td>{item.subject}</td>
                  <td>{item.className}</td>
                  <td className="capitalize">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
