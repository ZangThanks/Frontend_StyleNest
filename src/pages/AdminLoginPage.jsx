import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setLoggedInAccount, loggedInAccount } = useAuth();

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (loggedInAccount?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [loggedInAccount, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      // Gọi API login
      const response = await axios.post(`${API}/api/accounts/login`, {
        userName: username,
        password: password,
      });

      const accountData = response.data;

      // Kiểm tra role admin
      if (accountData.role === "admin") {
        setLoggedInAccount(accountData);
        console.log("Admin đăng nhập thành công!", accountData);
        navigate("/admin/dashboard");
      } else {
        setLoginError("Tài khoản không có quyền truy cập trang quản trị");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response?.status === 401) {
        setLoginError("Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        setLoginError(
          error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            StyleNest Admin
          </h1>
          <p className="text-gray-600">Đăng nhập vào trang quản trị</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {loginError}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium"
            >
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Quay về trang chủ
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Tài khoản test:</strong>
            <br />
            Username:{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">admin</code>
            <br />
            Password:{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">123456</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
