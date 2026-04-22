import { useState } from "react";
import { Search } from "lucide-react";
import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getTeacherStudents } from "../../services/teacherService";

export const TeacherStudentsPage = () => {
  const [query, setQuery] = useState({ search: "", className: "", page: 1, limit: 10 });
  const { data, loading, execute } = useAsync(() => getTeacherStudents(query), [query], { immediate: true });

  const handleFilter = async (event) => {
    event.preventDefault();
    await execute();
  };

  const students = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teacher Panel"
        title="Students list"
        description="Search, filter, and review the class roster."
      />

      <form className="card grid gap-4 md:grid-cols-[1fr_220px_140px]" onSubmit={handleFilter}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search by name, email, admission no"
            value={query.search}
            onChange={(event) => setQuery((current) => ({ ...current, search: event.target.value }))}
          />
        </div>
        <input
          className="input"
          placeholder="Class"
          value={query.className}
          onChange={(event) => setQuery((current) => ({ ...current, className: event.target.value }))}
        />
        <button className="btn-primary">Apply filters</button>
      </form>

      {loading ? (
        <Loader label="Loading students..." />
      ) : students.length === 0 ? (
        <EmptyState title="No students found" description="Try a different search or class filter." />
      ) : (
        <div className="card overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3">Student</th>
                <th className="pb-3">Admission No</th>
                <th className="pb-3">Class</th>
                <th className="pb-3">Guardian</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{student.user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{student.user.email}</p>
                  </td>
                  <td>{student.admissionNumber}</td>
                  <td>
                    {student.className}-{student.section}
                  </td>
                  <td>{student.guardianName || "N/A"}</td>
                  <td className="capitalize">{student.user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Showing page {meta?.page || 1} of {meta?.totalPages || 1}
          </p>
        </div>
      )}
    </div>
  );
};
