import React from 'react';
import { ExitToApp } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const LogoutButton = () => {

  async function logout() {

    const response = await fetch(`/api/logout`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await response;
  }

  const handleLogout = () => {
    // Perform any necessary logout actions here, such as clearing session/local storage or making API requests.
    logout();
  };

  return (
    <IconButton color="inherit" onClick={handleLogout} href='/'>
      <ExitToApp />
    </IconButton>
  );
};

export default LogoutButton;