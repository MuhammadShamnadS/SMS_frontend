import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RequireAuth = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireAuth;
