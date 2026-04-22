import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getStudentNotifications } from "../../services/studentService";
import { formatDateTime } from "../../utils/formatters";

export const StudentNotificationsPage = () => {
  const { data, loading } = useAsync(getStudentNotifications, []);
  if (loading) return <Loader label="Loading notifications..." />;

  const notifications = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Panel"
        title="Notifications"
        description="Stay on top of marks, attendance, and announcements in real time."
      />

      {notifications.length === 0 ? (
        <EmptyState title="No notifications yet" description="Updates from teachers and admins will appear here." />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{notification.message}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {notification.category}
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-400">{formatDateTime(notification.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
