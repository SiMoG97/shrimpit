import { GoogleSignInButton } from "@/components/Buttons";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerAuthSession();
  if (session) return redirect("/dashboard");
  return (
    <main>
      <h1>Login</h1>
      <GoogleSignInButton />
    </main>
  );
}
