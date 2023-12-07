import Link from "next/link";
import { SignOutButton } from "./Buttons";
import { getServerAuthSession } from "@/server/auth";

export default async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <nav className="container mx-auto flex justify-between bg-orange-500 ">
      <div className="logo">logo</div>
      <ul className="flex gap-4">
        {session ? (
          <>
            <li>{session.user.name}</li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/">Home</Link>
          </li>
        )}
        <li>
          <Link href="https://github.com/SiMoG97/shrimpit" target="_blank">
            Source code
          </Link>
        </li>
        <li>
          {session ? <SignOutButton /> : <Link href="/login">Log in</Link>}
        </li>
      </ul>
    </nav>
  );
}