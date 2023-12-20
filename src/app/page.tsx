import { DeleteButton } from "@/components/Buttons";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import EditUrlForm from "@/components/EditUrlForm";
import FormServer from "@/components/FormServer";
import { env } from "@/env";
import { postFormSchema } from "@/lib/zodSchemas";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { cookies } from "next/headers";
import Image from "next/image";
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
    <div className="m-auto mt-12 w-full max-w-3xl">
      <div className="mb-5 flex flex-col items-center">
        <Image
          src="/shrimpLogo.svg"
          width={0}
          height={0}
          className="h-auto w-20"
          alt="Shrimpit Logo"
        />
        <h1 className="text-4xl">Shrimpit</h1>
        <h2 className="text-2xl">Where Short Link Make a Big Splash!</h2>
        <p className="mt-3 text-center text-lg">
          Create short links, QR Codes, and Share them anywhere
          <br />
          Track what's working, and what's not. All inside the Shrimpit Platform
        </p>
      </div>
      <EditUrlForm showInputs={false} className="mb-7" />
      <div>
        <ul className="flex flex-col gap-3">
          {urls.map((url) => (
            <li
              className="flex items-center justify-between gap-4 border-4  border-black bg-gray-200 px-2 py-1.5 text-lg  font-medium"
              key={url.id}
            >
              <div className="grow truncate  ">{url.original_url}</div>
              <div className="b max-w-[25%] shrink-0 grow basis-1/4 text-right">
                <Link
                  className="block truncate font-bold text-blue-400 hover:text-blue-500 active:text-blue-600"
                  href={`${env.CLIENT_URL}/${url.short_url_key}`}
                >{`${env.HOST}/${url.short_url_key}`}</Link>
              </div>
              <div className="flex shrink-0 justify-end gap-2 ">
                <Image
                  src="/copyIcon.svg"
                  className="h-auto w-5"
                  width="0"
                  height="0"
                  alt="copy Icon"
                />
                <Image
                  src="/qrIcon.svg"
                  className="h-auto w-5"
                  width="0"
                  height="0"
                  alt="QR Icon"
                />
                <DeleteButton className="block" urlId={url.id}>
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
          ))}
        </ul>
      </div>
    </div>
  );
}
