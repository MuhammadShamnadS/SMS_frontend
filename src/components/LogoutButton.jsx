import React, { useContext } from "react";
import { Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Button  variant="Text" onClick={logout} 
    sx={{
        borderRadius:'100px',
        color: "white",
        "&:hover": { backgroundColor: "#0000002f" },
    }}>
      <LogoutIcon/>
      Logout
    </Button>
  );
};

export default LogoutButton;
