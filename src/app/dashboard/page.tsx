import { Button } from "@/components/Buttons";
import { env } from "@/env";
import { getServerAuthSession, loginIsRequiredServer } from "@/server/auth";
import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import Link from "next/link";

export default async function Dashboard() {
  await loginIsRequiredServer();
  const session = await getServerAuthSession();
  const urls = await db.url.findMany({
    where: {
      userId: session?.user.id,
    },
  });
  // revalidateTag("shortUrl");

  return (
    <div>
      <div className="flex justify-between">
        <div>Dashboard</div>
        <Link href="/create">Shrimp Url</Link>
      </div>
      <div>
        <ul>
          {urls.map(({ id, original_url, title, short_url_key, clicks }) => (
            <li key={id} className="flex gap-4">
              <div>{title}</div>
              <div>{original_url}</div>
              <div>
                <Link
                  href={`${env.NEXTAUTH_URL}/${short_url_key}`}
                >{`${env.NEXTAUTH_URL}/${short_url_key}`}</Link>
              </div>
              <div>{clicks}</div>
              <Link
                href={{
                  pathname: "/update",
                  query: {
                    id,
                    destination: original_url,
                    title,
                    customBackHalf: short_url_key,
                  },
                }}
              >
                Edit
              </Link>
              <Button urlId={id}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
