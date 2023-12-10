"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

type SignInOutType = {
  method: "signin" | "signout";
  classNames?: string;
  children: React.ReactNode;
};
export function SignInOutGoogle({
  method,
  classNames,
  children,
}: SignInOutType) {
  return (
    <button
      className={classNames}
      onClick={() => {
        if (method === "signin") {
          return signIn("google");
        }
        return signOut();
      }}
    >
      {children}
    </button>
  );
}

type ButtonT = {
  urlId: string;
  children: ReactNode;
};
export function Button({ urlId, children, ...props }: ButtonT) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function deleteShortUrl(id: string) {
    setIsLoading(true);
    await fetch(`/api/shortUrl`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.refresh();
  }
  return (
    <button
      className="bg-red-500 p-2 text-white"
      onClick={() => deleteShortUrl(urlId)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Deleting..." : children}
    </button>
  );
}
