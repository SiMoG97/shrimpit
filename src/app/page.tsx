import { Button } from "@/components/Buttons";
import EditUrlForm from "@/components/EditUrlForm";
import FormServer from "@/components/FormServer";
import { env } from "@/env";
import { postFormSchema } from "@/lib/zodSchemas";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { cookies } from "next/headers";
import Link from "next/link";
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
      {/* <FormServer /> */}
      <EditUrlForm showInputs={false} />
      <div>
        <ul>
          {urls.map((url) => (
            <li key={url.id}>
              <div>
                {url.original_url}{" "}
                <Link
                  href={`${env.CLIENT_URL}/${url.short_url_key}`}
                >{`${env.CLIENT_URL}/${url.short_url_key}`}</Link>{" "}
                {url.clicks}
              </div>
              <Button urlId={url.id}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
