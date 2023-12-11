import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ShortUrlT = {
  params: { shortUrl: string };
};
export default async function page({ params }: ShortUrlT) {
  let urlFromDb;
  try {
    urlFromDb = await db.url.update({
      where: {
        short_url_key: params.shortUrl,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  } catch (e) {
    console.log(e);
    return <h2>url not found</h2>;
  } finally {
    if (urlFromDb) redirect(urlFromDb.original_url);
  }
}
