import { NextResponse } from "next/server";
import { getCmsSession } from "@/lib/cms/auth";

export async function GET() {
  const session = await getCmsSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, username: session.username });
}
