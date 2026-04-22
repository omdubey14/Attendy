import { BookOpen, CalendarClock, Download, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { StatCard } from "../../components/common/StatCard";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { downloadReportCard, getStudentDashboard } from "../../services/studentService";
import { downloadBlobFile } from "../../utils/downloadBlob";
import { formatDate } from "../../utils/formatters";

export const StudentDashboardPage = () => {
  const { data, loading } = useAsync(getStudentDashboard, []);

  const handleDownload = async () => {
    const blob = await downloadReportCard();
    downloadBlobFile(blob, "report-card.pdf");
    toast.success("Report card downloaded");
  };

  if (loading) return <Loader label="Loading student dashboard..." />;

  const payload = data?.data;
  const stats = [
    {
      label: "Average Marks",
      value: payload.summary.averageMarks,
      icon: TrendingUp,
    },
    {
      label: "Present Days",
      value: payload.summary.attendance.present,
      icon: CalendarClock,
    },
    {
      label: "Marks Uploaded",
      value: payload.marks.length,
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Panel"
        title="Your learning snapshot"
        description="Track attendance, results, and announcements from one place."
        action={
          <button type="button" className="btn-primary" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download report card
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent marks</h3>
          <div className="mt-5 space-y-3">
            {payload.marks.slice(0, 5).map((mark) => (
              <div
                key={mark._id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{mark.subject}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{mark.examType}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sky-500">
                    {mark.score}/{mark.maximumScore}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{mark.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent notifications</h3>
          <div className="mt-5 space-y-3">
            {payload.notifications.map((notification) => (
              <div key={notification._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{notification.message}</p>
                <p className="mt-3 text-xs text-slate-400">{formatDate(notification.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
