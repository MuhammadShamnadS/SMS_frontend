import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const PublicLayout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      setChecking(false);
    }
  }, [user, navigate]);

  if (checking) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
};

export default PublicLayout;
