import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getAdminLogs } from "../../services/adminService";
import { formatDateTime } from "../../utils/formatters";

export const AdminLogsPage = () => {
  const { data, loading } = useAsync(() => getAdminLogs({ page: 1, limit: 20 }), []);
  if (loading) return <Loader label="Loading logs..." />;

  const logs = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="System logs"
        description="Audit important actions performed inside the platform."
      />

      <div className="card overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="pb-3">Timestamp</th>
              <th className="pb-3">Actor</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">Target</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-4">{formatDateTime(log.createdAt)}</td>
                <td>{log.actor?.name || "System"}</td>
                <td>{log.action}</td>
                <td>
                  {log.targetType} {log.targetId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
