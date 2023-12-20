import { DeleteButton } from "@/components/Buttons";
import QrCodeComp from "@/components/QrCodeComp";
import { env } from "@/env";
import { getServerAuthSession, loginIsRequiredServer } from "@/server/auth";
import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import Link from "next/link";
import CustomButton from "@/components/CustomButton";

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
        <CustomButton>
          <Link href="/create">Shrimp Url</Link>
        </CustomButton>
      </div>
      <div>
        <ul>
          {urls.map(({ id, original_url, title, short_url_key, clicks }) => (
            <li key={id} className="flex gap-4">
              <div>{title}</div>
              <div>{original_url}</div>
              <div>
                <Link
                  href={`${env.CLIENT_URL}/${short_url_key}`}
                >{`${env.HOST}/${short_url_key}`}</Link>
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
              <QrCodeComp shortUrl={`${env.CLIENT_URL}/${short_url_key}`} />
              {/* <QRCodeSVG
                value={`${env.CLIENT_URL}/${short_url_key}`}
                size={256}
              /> */}
              {/* <QRCodeCanvas
                value={`${env.CLIENT_URL}/${short_url_key}`}
                size={256}
              /> */}
              <DeleteButton urlId={id}>Delete</DeleteButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
