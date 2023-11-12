"use client";
import { signIn } from "next-auth/react";

export const Login = () => (
  <>
    Not signed in <br />
    <button onClick={() => signIn()}>Sign in</button>
  </>
);
