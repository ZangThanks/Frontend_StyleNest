import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInAccount, setLoggedInAccount] = useState(null);

  // Load user from localStorage khi app khởi động
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInAccount");
    if (savedUser) {
      try {
        setLoggedInAccount(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("loggedInAccount");
      }
    }
  }, []);

  // Save to localStorage whenever loggedInAccount changes
  useEffect(() => {
    if (loggedInAccount) {
      localStorage.setItem("loggedInAccount", JSON.stringify(loggedInAccount));
    } else {
      localStorage.removeItem("loggedInAccount");
    }
  }, [loggedInAccount]);

  const handleLogut = () => {
    setLoggedInAccount(null);
    localStorage.removeItem("loggedInAccount");
  };

  const login = (accountData) => {
    setLoggedInAccount(accountData);
  };

  // Thêm các giá trị tương thích với ProtectedRoute
  const isAuthenticated = !!loggedInAccount;
  const user = loggedInAccount;

  return (
    <AuthContext.Provider
      value={{
        loggedInAccount,
        setLoggedInAccount,
        handleLogut,
        login,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
