import { BookOpen, ClipboardCheck, School, Users } from "lucide-react";
import { ClassPieChart } from "../../components/charts/ClassPieChart";
import { PerformanceBarChart } from "../../components/charts/PerformanceBarChart";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/common/StatCard";
import { useAsync } from "../../hooks/useAsync";
import { getAdminDashboard } from "../../services/adminService";

export const AdminDashboardPage = () => {
  const { data, loading } = useAsync(getAdminDashboard, []);
  if (loading) return <Loader label="Loading admin analytics..." />;

  const payload = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Institution analytics"
        description="Monitor growth, approvals, attendance activity, and academic performance."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={payload.stats.students} icon={Users} />
        <StatCard label="Teachers" value={payload.stats.teachers} icon={School} />
        <StatCard label="Pending Approvals" value={payload.stats.pendingApprovals} icon={ClipboardCheck} />
        <StatCard label="Marks Entries" value={payload.stats.marksCount} icon={BookOpen} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ClassPieChart data={payload.charts.classBreakdown} />
        <PerformanceBarChart data={payload.charts.performanceBreakdown} />
      </div>
    </div>
  );
};
