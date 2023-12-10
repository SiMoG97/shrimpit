import { formSchema } from "@/lib/formSchema";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { type Url } from "@prisma/client";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();

    // Validating the request body
    const { destination, customBackHalf, title } = formSchema.parse(
      await req.json(),
    );

    // Creates the shortUrl id
    const short_url_key = customBackHalf ?? nanoid(8);

    // Checks if the request is from a logged in user
    // if so, save the new shortUrl with the user
    if (session) {
      const newUrl = await db.url.create({
        data: {
          original_url: destination,
          short_url_key,
          title,
          User: { connect: { id: session.user.id } },
        },
      });
      return NextResponse.json(newUrl);
    }

    // if the user is not logged in, retrive the user_identifier from the cookie
    // and associate that cookie id with the new created shortUrl
    const user_identifier =
      req.cookies.get("user_identifier")?.value ?? nanoid(64);

    const newUrl = await db.url.create({
      data: {
        original_url: destination,
        short_url_key,
        title,
        user_identifier,
      },
    });

    const response = NextResponse.json(newUrl, { status: 201 });
    if (!response.cookies.has("user_identifier")) {
      response.cookies.set("user_identifier", user_identifier, {
        secure: true,
        httpOnly: true,
      });
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      let status = 500;
      if (error instanceof ZodError) {
        status = 400;
      }
      console.error(error);
      return NextResponse.json(error, { status });
    }
  }
}

export async function DELETE(req: NextRequest) {
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
