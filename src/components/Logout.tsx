"use client";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";

export const Logout = () => (
  <IconButton color="inherit" onClick={() => signOut()}>
    <LogoutIcon />
  </IconButton>
);
