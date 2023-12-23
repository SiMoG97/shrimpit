"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode, type ComponentProps, useRef } from "react";

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

type CopyBtnT = {
  textToCopy: string;
} & ComponentProps<"button">;

export function CopyButton({ textToCopy, children, ...props }: CopyBtnT) {
  const popupRef = useRef<HTMLDivElement>(null);
  const showPopupHandler = () => {
    if (!popupRef.current) return;
    popupRef.current.style.opacity = "1";

    setTimeout(() => {
      if (!popupRef.current) return;
      popupRef.current.style.opacity = "0";
    }, 2000);
  };
  return (
    <>
      <button
        title="Copy Short Url"
        onClick={async () => {
          await navigator.clipboard.writeText(textToCopy);
          showPopupHandler();
        }}
        {...props}
      >
        {children}
      </button>
      <div
        ref={popupRef}
        className="pointer-events-none fixed bottom-5 left-[50%] translate-x-[-50%] border-4 border-green-500 bg-white px-4 py-2 opacity-0 transition-opacity"
      >
        copied
      </div>
    </>
  );
}

type DeleteBtnT = {
  urlId: string;
  children: ReactNode;
} & ComponentProps<"button">;

export function DeleteButton({ urlId, children, ...props }: DeleteBtnT) {
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
      // className={`${className}`}
      onClick={() => deleteShortUrl(urlId)}
      disabled={isLoading}
      title="Delete Short Url"
      {...props}
    >
      {isLoading ? <SpinningCircle /> : children}
    </button>
  );
}

function SpinningCircle() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline h-5 w-5 animate-spin fill-gray-200 text-gray-200 dark:text-black"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
