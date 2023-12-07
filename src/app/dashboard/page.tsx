import { loginIsRequiredServer } from "@/server/auth";
import Link from "next/link";

export default async function Dashboard() {
  await loginIsRequiredServer();
  return (
    <div className="flex justify-between">
      <div>Dashboard</div>
      <Link href="/create">Shrimp Url</Link>
    </div>
  );
}
