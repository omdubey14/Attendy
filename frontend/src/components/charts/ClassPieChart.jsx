import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const ClassPieChart = ({ data }) => (
  <div className="card h-[320px]">
    <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Class Strength</h3>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="students" nameKey="_id" outerRadius={100} innerRadius={55}>
          {data.map((entry, index) => (
            <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
