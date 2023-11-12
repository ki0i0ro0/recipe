"use client";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export const Logout = () => (
  <Button color="inherit" onClick={() => signOut()}>
    ログアウト
  </Button>
);
