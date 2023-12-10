import { deleteBodySchema, formSchema } from "@/lib/zodSchemas";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
  try {
    const session = await getServerAuthSession();

    const { id } = deleteBodySchema.parse(await req.json());
    const user_identifier = req.cookies.get("user_identifier")?.value;

    await db.url.delete({
      where: {
        id,
        userId: session ? session.user.id : null,
        user_identifier: session ? null : user_identifier ?? null,
      },
    });

    return NextResponse.json({ message: `Deleted short url's id: ${id}` });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      let status = 500;
      if (error instanceof ZodError) status = 400;
      else if (error instanceof PrismaClientKnownRequestError) status = 404;

      return NextResponse.json(error, { status });
    }
  }
}
