import { Button } from "@/components/Buttons";
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
          {urls.map((url) => (
            <li key={url.id} className="flex gap-4">
              <div>{url.original_url}</div>
              <div>{url.short_url_key}</div>
              <div>{url.clicks}</div>
              <Button urlId={url.id}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
