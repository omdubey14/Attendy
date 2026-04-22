import { useState } from "react";
import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getAdminUsers, updateRegistrationStatus } from "../../services/adminService";
import { formatDate } from "../../utils/formatters";

export const AdminUsersPage = () => {
  const [filters, setFilters] = useState({ role: "", status: "", search: "", page: 1, limit: 10 });
  const { data, loading, execute } = useAsync(() => getAdminUsers(filters), [filters], { immediate: true });

  const handleStatus = async (id, status) => {
    await updateRegistrationStatus(id, { status });
    await execute();
  };

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Manage users"
        description="Approve registrations, search accounts, and review role-based access."
      />

      <div className="card grid gap-4 md:grid-cols-4">
        <input className="input" placeholder="Search" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
        <select className="input" onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}>
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <select className="input" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className="btn-primary" onClick={execute}>
          Refresh
        </button>
      </div>

      {loading ? (
        <Loader label="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Adjust filters or add sample data." />
      ) : (
        <div className="card overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3">Name</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Created</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </td>
                  <td className="capitalize">{user.role}</td>
                  <td className="capitalize">{user.status}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-secondary px-3 py-2" onClick={() => handleStatus(user._id, "approved")}>
                        Approve
                      </button>
                      <button className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white" onClick={() => handleStatus(user._id, "rejected")}>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
