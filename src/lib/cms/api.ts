import { NextResponse } from "next/server";
import { getCmsSession } from "@/lib/cms/auth";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireCmsApi() {
  const session = await getCmsSession();
  if (!session) return { session: null, error: jsonError("غير مصرح", 401) };
  return { session, error: null };
}
