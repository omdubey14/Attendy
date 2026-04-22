import {
  Bell,
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";

export const navigationByRole = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Classes", path: "/admin/classes", icon: School },
    { label: "Reports", path: "/admin/reports", icon: LineChart },
    { label: "Logs", path: "/admin/logs", icon: ShieldCheck },
  ],
  teacher: [
    { label: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { label: "Students", path: "/teacher/students", icon: Users },
    { label: "Attendance", path: "/teacher/attendance", icon: ClipboardList },
    { label: "Marks", path: "/teacher/marks", icon: BookOpen },
    { label: "Announcements", path: "/teacher/announcements", icon: Bell },
  ],
  student: [
    { label: "Dashboard", path: "/student", icon: LayoutDashboard },
    { label: "Profile", path: "/student/profile", icon: GraduationCap },
    { label: "Attendance", path: "/student/attendance", icon: ClipboardList },
    { label: "Marks", path: "/student/marks", icon: BookOpen },
    { label: "Notifications", path: "/student/notifications", icon: Bell },
  ],
};
