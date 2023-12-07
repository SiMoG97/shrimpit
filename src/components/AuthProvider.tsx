"use client";

import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";

type PropsT = {
  children: ReactNode;
};
export default function AuthProvider({ children }: PropsT) {
  return <SessionProvider>{children}</SessionProvider>;
}
