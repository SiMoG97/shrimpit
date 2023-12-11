import { UnauthorizedError } from "@/lib/errors";
import {
  deleteBodySchema,
  postFormSchema,
  putFormSchema,
} from "@/lib/zodSchemas";
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
    const { destination, customBackHalf, title } = postFormSchema.parse(
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
    console.error(error);
    if (!(error instanceof Error)) return;

    let status = 500;
    if (error instanceof ZodError) status = 400;
    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error.code);
      status = 409;
    }
    // return NextResponse.error();
    return NextResponse.json(error, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerAuthSession();

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Validating the request body
    const { destination, customBackHalf, title, id } = putFormSchema.parse(
      await req.json(),
    );
    // find the shortUrl before updating it
    const urlToUpdate = await db.url.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });
    // if not found send 404 status code
    if (!urlToUpdate)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // check if the body is the same as url from db, then return
    if (
      customBackHalf === urlToUpdate.short_url_key &&
      title === urlToUpdate.title &&
      destination === urlToUpdate.original_url
    ) {
      return NextResponse.json({ message: "Nothing changed" });
    }

    // check if customBackHalf is nullable fallback to nanoid
    const short_url_key = !!customBackHalf ? customBackHalf : nanoid(8);

    const updatedUrl = await db.url.update({
      where: { id, userId: session.user.id },
      data: {
        original_url: destination,
        short_url_key,
        title,
        User: { connect: { id: session.user.id } },
        // if the short_url_key updated. reset the counter to 0 zero
        clicks:
          urlToUpdate.short_url_key !== customBackHalf ? 0 : urlToUpdate.clicks,
      },
    });
    return NextResponse.json(updatedUrl, { status: 201 });
  } catch (error) {
    console.error(error);
    if (!(error instanceof Error)) return;
    let status = 500;
    if (error instanceof ZodError) status = 400;
    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error.code);
      status = 409;
    }
    return NextResponse.json(error, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerAuthSession();

    const { id } = deleteBodySchema.parse(await req.json());
    const user_identifier = req.cookies.get("user_identifier")?.value;

    if (!session && !user_identifier) throw new UnauthorizedError();

    await db.url.delete({
      where: {
        id,
        userId: session ? session.user.id : null,
        user_identifier: session ? null : user_identifier ?? null,
      },
    });

    return NextResponse.json({ message: `Deleted short url's id: ${id}` });
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error)) return;

    let status = 500;
    if (error instanceof ZodError) status = 400;
    else if (error instanceof PrismaClientKnownRequestError) status = 404;
    else if (error instanceof UnauthorizedError) status = 401;

    return NextResponse.json(error, { status });
  }
}
