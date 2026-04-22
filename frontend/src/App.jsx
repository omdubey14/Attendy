import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { Loader } from "./components/common/Loader";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { useAuth } from "./context/AuthContext";

const LoginPage = lazy(() =>
  import("./pages/auth/LoginPage").then((module) => ({ default: module.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("./pages/auth/RegisterPage").then((module) => ({ default: module.RegisterPage }))
);
const PendingApprovalPage = lazy(() =>
  import("./pages/shared/PendingApprovalPage").then((module) => ({
    default: module.PendingApprovalPage,
  }))
);
const NotFoundPage = lazy(() =>
  import("./pages/shared/NotFoundPage").then((module) => ({ default: module.NotFoundPage }))
);
const StudentDashboardPage = lazy(() =>
  import("./pages/student/StudentDashboardPage").then((module) => ({
    default: module.StudentDashboardPage,
  }))
);
const StudentProfilePage = lazy(() =>
  import("./pages/student/StudentProfilePage").then((module) => ({
    default: module.StudentProfilePage,
  }))
);
const StudentAttendancePage = lazy(() =>
  import("./pages/student/StudentAttendancePage").then((module) => ({
    default: module.StudentAttendancePage,
  }))
);
const StudentMarksPage = lazy(() =>
  import("./pages/student/StudentMarksPage").then((module) => ({
    default: module.StudentMarksPage,
  }))
);
const StudentNotificationsPage = lazy(() =>
  import("./pages/student/StudentNotificationsPage").then((module) => ({
    default: module.StudentNotificationsPage,
  }))
);
const TeacherDashboardPage = lazy(() =>
  import("./pages/teacher/TeacherDashboardPage").then((module) => ({
    default: module.TeacherDashboardPage,
  }))
);
const TeacherStudentsPage = lazy(() =>
  import("./pages/teacher/TeacherStudentsPage").then((module) => ({
    default: module.TeacherStudentsPage,
  }))
);
const TeacherAttendancePage = lazy(() =>
  import("./pages/teacher/TeacherAttendancePage").then((module) => ({
    default: module.TeacherAttendancePage,
  }))
);
const TeacherMarksPage = lazy(() =>
  import("./pages/teacher/TeacherMarksPage").then((module) => ({
    default: module.TeacherMarksPage,
  }))
);
const TeacherAnnouncementsPage = lazy(() =>
  import("./pages/teacher/TeacherAnnouncementsPage").then((module) => ({
    default: module.TeacherAnnouncementsPage,
  }))
);
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((module) => ({
    default: module.AdminDashboardPage,
  }))
);
const AdminUsersPage = lazy(() =>
  import("./pages/admin/AdminUsersPage").then((module) => ({
    default: module.AdminUsersPage,
  }))
);
const AdminClassesPage = lazy(() =>
  import("./pages/admin/AdminClassesPage").then((module) => ({
    default: module.AdminClassesPage,
  }))
);
const AdminReportsPage = lazy(() =>
  import("./pages/admin/AdminReportsPage").then((module) => ({
    default: module.AdminReportsPage,
  }))
);
const AdminLogsPage = lazy(() =>
  import("./pages/admin/AdminLogsPage").then((module) => ({ default: module.AdminLogsPage }))
);

const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.status === "pending") return <Navigate to="/pending" replace />;
  return <Navigate to={`/${user?.role}`} replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader label="Loading workspace..." />}>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pending" element={<PendingApprovalPage />} />

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student" element={<StudentDashboardPage />} />
              <Route path="/student/profile" element={<StudentProfilePage />} />
              <Route path="/student/attendance" element={<StudentAttendancePage />} />
              <Route path="/student/marks" element={<StudentMarksPage />} />
              <Route path="/student/notifications" element={<StudentNotificationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/teacher" element={<TeacherDashboardPage />} />
              <Route path="/teacher/students" element={<TeacherStudentsPage />} />
              <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
              <Route path="/teacher/marks" element={<TeacherMarksPage />} />
              <Route path="/teacher/announcements" element={<TeacherAnnouncementsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/classes" element={<AdminClassesPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/logs" element={<AdminLogsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
