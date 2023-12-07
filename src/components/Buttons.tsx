"use client";

import { signIn, signOut } from "next-auth/react";

export function GoogleSignInButton() {
  return (
    <button
      className="w=full transi focus:shadow-outline mt-4 flex h-14 items-center justify-center rounded-lg border-2 border-black bg-white px-6 text-xl font-semibold text-black duration-300 hover:bg-slate-200"
      onClick={() => signIn("google")}
    >
      Continue with Google
    </button>
  );
}
export function SignOutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
