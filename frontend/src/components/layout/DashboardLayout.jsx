import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const DashboardLayout = () => (
  <div className="page-shell min-h-screen p-4 lg:p-6">
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
      <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
        <Sidebar />
      </div>
      <div className="space-y-6">
        <Topbar />
        <Outlet />
      </div>
    </div>
  </div>
);
