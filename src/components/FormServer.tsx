import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

export default function FormServer() {
  //   console.log(cookies().get("user_identifier"));
  //   console.log(cookies().);
  async function handleAction(formData: FormData) {
    "use server";
    if (!cookies().get("user_identifier")) {
      cookies().set("user_identifier", nanoid(64), {
        secure: true,
        httpOnly: true,
      });
    }
    const user_identifier = cookies().get("user_identifier")?.value;
    // console.log(user_identifier);

    await db.url.create({
      data: {
        clicks: 0,
        user_identifier,
        short_url_key: nanoid(6),
        original_url: formData.get("original_url") as string,
      },
    });
    revalidatePath("/");
  }
  return (
    <div>
      <form action={handleAction}>
        <input
          type="text"
          placeholder="Long url"
          required
          name="original_url"
        />
        <button>Submit</button>
      </form>
    </div>
  );
}
