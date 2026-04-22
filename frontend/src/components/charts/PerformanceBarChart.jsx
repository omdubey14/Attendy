import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const PerformanceBarChart = ({ data }) => (
  <div className="card h-[320px]">
    <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Performance</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
        <XAxis dataKey="_id" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip />
        <Bar dataKey="averageScore" fill="#0ea5e9" radius={[12, 12, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
