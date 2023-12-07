import FormServer from "@/components/FormServer";
import { formSchema } from "@/lib/formSchema";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import HomeForm from "@/components/HomeForm";

export default async function HomePage() {
  const session = await getServerAuthSession();
  if (session) return redirect("/dashboard");

  const userIdentifier = cookies().get("user_identifier")?.value;

  const urls = userIdentifier
    ? await db.url.findMany({
        where: {
          user_identifier: userIdentifier,
        },
      })
    : [];

  return (
    <div>
      {/* <HomeForm /> */}
      <FormServer />
      <div>
        <ul>
          {urls.map((url) => (
            <li key={url.id}>
              {url.original_url} {url.short_url_key} {url.clicks}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
