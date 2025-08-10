import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router";
import Spinner from "./Spinner";

const ProtectedRoute = () => {
  const { token, user, isInitialized, isLoading } = useAuth();

  // Show loading spinner while checking authentication status
  if (!isInitialized || isLoading) {
    return (
      <div className="h-dvh flex justify-center items-center w-screen">
        <Spinner />
      </div>
    );
  }

  // If user has token and user type, allow access
  if (token && user) {
    return <Outlet />;
  }

  // If no token but we have user type from previous session, redirect to appropriate login
  if (user) {
    return <Navigate to={`/${user}/login`} replace />;
  }

  // Default fallback - redirect to seller login
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
