
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    const storedUser = localStorage.getItem("ChatApp");

    if (jwt && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?._id) {
          setAuthUser(parsedUser);
        } else {
          logout();
        }
      } catch (error) {
        console.error("❌ Failed to parse user data:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, jwt) => {
    if (jwt && userData) {
      setAuthUser(userData);
      Cookies.set("jwt", jwt, { expires: 1, secure: false, path: "/", sameSite: "Lax" });
      localStorage.setItem("ChatApp", JSON.stringify(userData));
      console.log("✅ User logged in successfully:", userData);
    }
  };

  const logout = () => {
    setAuthUser(null);
    Cookies.remove("jwt");
    localStorage.removeItem("ChatApp");
    console.log("🚪 User logged out.");
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
