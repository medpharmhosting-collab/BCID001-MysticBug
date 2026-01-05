import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Loader from "./Pages/admin/Loader";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl"><Loader /></div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user || !role) {
    return <Navigate to="/" replace />;
  }

  // Redirect if role doesn't match
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute