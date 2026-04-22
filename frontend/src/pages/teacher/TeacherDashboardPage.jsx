import { Bell, BookOpen, School } from "lucide-react";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/common/StatCard";
import { useAsync } from "../../hooks/useAsync";
import { getTeacherDashboard } from "../../services/teacherService";
import { formatDate } from "../../utils/formatters";

export const TeacherDashboardPage = () => {
  const { data, loading } = useAsync(getTeacherDashboard, []);
  if (loading) return <Loader label="Loading teacher dashboard..." />;

  const payload = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teacher Panel"
        title="Teaching operations"
        description="Manage attendance, publish marks, and communicate with your students."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Classes Assigned" value={payload.stats.classesAssigned} icon={School} />
        <StatCard label="Attendance Marked" value={payload.stats.attendanceMarked} icon={BookOpen} />
        <StatCard label="Announcements" value={payload.announcements.length} icon={Bell} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Assigned classes</h3>
          <div className="mt-4 space-y-3">
            {payload.classes.map((classRoom) => (
              <div key={classRoom._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Class {classRoom.name}-{classRoom.section}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Subjects: {classRoom.subjects.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent announcements</h3>
          <div className="mt-4 space-y-3">
            {payload.announcements.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                <p className="mt-3 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
