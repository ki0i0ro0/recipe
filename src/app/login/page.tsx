"use client";
import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <>
      Not signed in <br />
      <button
        type="button"
        onClick={() => {
          signIn("google", { callbackUrl: "/" });
        }}
      >
        Sign in
      </button>
    </>
  );
}
