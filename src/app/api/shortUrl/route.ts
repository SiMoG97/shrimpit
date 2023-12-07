import { type FormType } from "@/lib/formSchema";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as FormType;
  console.log("from api", body);
  return NextResponse.json({ name: "simo echaarani" });
  // NextResponse.
}
