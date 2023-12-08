"use client";

import { signIn, signOut } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, useState, type ReactNode } from "react";

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
    // setIsLoading(false);
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
