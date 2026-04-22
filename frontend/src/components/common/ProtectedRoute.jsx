import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./Loader";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <Loader label="Checking session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.status === "pending") return <Navigate to="/pending" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/${user?.role || "login"}`} replace />;
  }

  return <Outlet />;
};
