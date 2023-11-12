"use client";
import { signIn } from "next-auth/react";

const Login = () => (
  <>
    Not signed in <br />
    <button onClick={() => signIn("google", { callbackUrl: "/" })}>
      Sign in
    </button>
  </>
);

export default Login;
