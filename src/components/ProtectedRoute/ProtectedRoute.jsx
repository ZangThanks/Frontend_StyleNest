import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
  const { loggedInAccount, isAuthenticated } = useAuth();

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute - loggedInAccount:", loggedInAccount);

  // Chưa đăng nhập -> redirect về trang admin login
  if (!isAuthenticated || !loggedInAccount) {
    console.log("Not authenticated, redirecting to admin login");
    return <Navigate to="/admin/login" replace />;
  }

  // Đã đăng nhập nhưng không phải admin
  if (requiredRole && loggedInAccount.role !== requiredRole) {
    console.log(
      `User role ${loggedInAccount.role} doesn't match required role ${requiredRole}`
    );
    return <Navigate to="/" replace />;
  }

  console.log("Access granted to protected route");
  return children;
};

export default ProtectedRoute;
