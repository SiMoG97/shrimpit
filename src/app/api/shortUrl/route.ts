import { type FormType } from "@/lib/formSchema";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { type Url } from "@prisma/client";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  //check if there is a session
  //   create shortUrl with the session user
  // else
  //    check if there is a user_identifier
  //        create the new shortUrl with the same cookie id
  //    else
  //        create a new user_id cookie and ceate the shortUrl
  const session = await getServerAuthSession();
  const { destination, customBackHalf, title } = (await req.json()) as FormType;

  if (!session)
    return new NextResponse(JSON.stringify({ message: "Not Authorized" }), {
      status: 401,
    });
  let short_url_key = nanoid(8);
  if (customBackHalf) {
    short_url_key = customBackHalf;
  }

  // console.log("nanoid ", short_url_key);
  try {
    const newUrl = await db.url.create({
      data: {
        original_url: destination,
        short_url_key,
        title,
        User: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json(newUrl);
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: "user not loged in" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerAuthSession();
  if (!session)
    return new NextResponse(JSON.stringify({ message: "Not Authorized" }), {
      status: 401,
    });

  const { id } = (await req.json()) as Url;

  const urlToDelete = await db.url.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
  });
  if (!id || !urlToDelete) {
    return new NextResponse(
      JSON.stringify({ message: "Short url not found or invalid request." }),
      { status: 400 },
    );
  }

  await db.url.delete({ where: { id: urlToDelete.id } });
  // return NextResponse.json({
  //   message: `Deleted short url's id: ${urlToDelete.id}`,

  // });
  return Response.json({
    message: `Deleted short url's id: ${urlToDelete.id}`,
    revalidatePath: true,
  });
}
