import React, { useContext } from "react";
import { Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Button  variant="outlined" color="error" onClick={logout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
