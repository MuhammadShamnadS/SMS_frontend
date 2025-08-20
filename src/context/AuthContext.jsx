import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    return storedUser && token ? JSON.parse(storedUser) : null;
  });

  // login function
  const login = async (username, password) => {
    try {
      const res = await API.post("/login", { username, password });

      if (res.data.access_token && res.data.refresh_token) {
        localStorage.setItem("accessToken", res.data.access_token);
        localStorage.setItem("refreshToken", res.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data.user;
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      throw err;
    }
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
