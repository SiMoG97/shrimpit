import Link from "next/link";
import { SignInOutGoogle } from "./Buttons";
import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";

export default async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <nav className="mx-auto w-full border-b-4 border-black">
      <div className=" mx-auto flex w-full max-w-4xl items-center  justify-between px-2 py-3 text-lg">
        <div className="logo">
          <Link href={session ? "/dashboard" : "/"}>
            <Image
              src="/shrimpLogo.svg"
              width={0}
              height={0}
              className="h-auto w-10"
              alt="Shrimpit Logo"
            />
          </Link>
        </div>
        <ul className="flex gap-4">
          {session ? (
            <>
              <li className="sm:bl800 hidden hover:text-gray-500 active:text-gray-400">
                {session.user.name}
              </li>
              <li className="sm:bl800 hidden hover:text-gray-500 active:text-gray-400">
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </>
          ) : null}
          <li className=" hover:text-gray-500 active:text-gray-400">
            <Link href="https://github.com/SiMoG97/shrimpit" target="_blank">
              Source
            </Link>
          </li>
          <li className=" hover:text-gray-500 active:text-gray-400">
            <SignInOutGoogle method={session ? "signout" : "signin"}>
              {session ? "Sign out" : "Continue with Google"}
            </SignInOutGoogle>
          </li>
        </ul>
      </div>
      {/* </div> */}
    </nav>
  );
}
