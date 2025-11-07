import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
  const { user, isAuthenticated } = useAuth();

  // Chưa đăng nhập -> redirect về trang chủ hoặc login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Đã đăng nhập nhưng không phải admin
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
