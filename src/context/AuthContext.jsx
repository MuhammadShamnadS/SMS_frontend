import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  

  //login function
  const login = async (username, password) => {
    try{
    const res = await API.post("/login",{
      username,
      password
    });
  if ( res.data.token){
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }else{
    throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      throw err;
    }
  };

  //logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
