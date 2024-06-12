import { CopyButton, DeleteButton } from "@/components/Buttons";
import { env } from "@/env";
import { getServerAuthSession, loginIsRequiredServer } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import CustomButton from "@/components/CustomButton";
import { pluralOrNot } from "@/lib/helpers";
import DownloadQR from "@/components/QrCodeComp";
import Image from "next/image";

export default async function Dashboard() {
  await loginIsRequiredServer();
  const session = await getServerAuthSession();
  const urls = await db.url.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return (
    <>
      <title>Dashboard - Shrimpit</title>
      <div>
        <div className="mb-9 mt-5 flex items-center justify-between">
          <div className="text-3xl font-medium">Links</div>
          <Link href="/create">
            <CustomButton>Shrimp Url</CustomButton>
          </Link>
        </div>
        {urls.length === 0 && (
          <div className="py-10 text-center text-xl">
            You have 0 Shrimped urls
          </div>
        )}
        {urls.length !== 0 && (
          <div>
            <ul className="flex flex-col gap-4">
              {urls.map((url) => {
                const {
                  id,
                  clicks,
                  created_at,
                  original_url,
                  title,
                  short_url_key,
                } = url;
                const shortUrl = `${env.CLIENT_URL}/${short_url_key}`;
                return (
                  <li
                    key={id}
                    className="flex flex-col justify-between gap-4 border-4 border-black p-3 sm:flex-row"
                  >
                    <div>
                      <div className="truncate text-2xl">Title: {title}</div>
                      <div className="flex items-center gap-3">
                        <Link
                          target="_blank"
                          href={`${env.CLIENT_URL}/${short_url_key}`}
                          className="truncate"
                        >{`${env.HOST}/${short_url_key}`}</Link>
                        <CopyButton
                          textToCopy={shortUrl}
                          className="hover:opacity-70 active:scale-95 active:opacity-50"
                        >
                          <Image
                            src="/copyIcon.svg"
                            className="hover:path- h-auto w-5"
                            width="0"
                            height="0"
                            alt="copy Icon"
                          />
                        </CopyButton>
                      </div>
                      <div className="truncate">{original_url}</div>
                      <div className="mt-3 flex gap-5 text-xs">
                        <div>
                          {clicks} {pluralOrNot(clicks, "click")}
                        </div>
                        <div>
                          {created_at.getDate()}/{created_at.getMonth() + 1}/
                          {created_at.getUTCFullYear()}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-3">
                      <Link
                        className="flex items-center hover:opacity-70 active:scale-95 active:opacity-50"
                        title="Edit Url"
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
                        <Image
                          src="/penIcon.svg"
                          className=" h-auto w-5"
                          width="0"
                          height="0"
                          alt="Pen to edit Url Icon"
                        />
                      </Link>
                      <DownloadQR
                        shortUrl={shortUrl}
                        className="block hover:opacity-70 active:scale-95 active:opacity-50"
                      >
                        <Image
                          src="/qrIcon.svg"
                          className="h-auto w-5"
                          width="0"
                          height="0"
                          alt="QR Icon"
                        />
                      </DownloadQR>
                      <DeleteButton
                        urlId={url.id}
                        className="block hover:opacity-70 active:scale-95 active:opacity-50"
                      >
                        <Image
                          src="/crossIcon.svg"
                          width={0}
                          height={0}
                          className="h-auto w-5 cursor-pointer"
                          alt="Cross Icon"
                        />
                      </DeleteButton>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
