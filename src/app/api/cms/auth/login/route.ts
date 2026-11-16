import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  verifyAdminCredentials,
} from "@/lib/cms/auth";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  if (!username || !password) {
    return NextResponse.json({ error: "أدخل اسم المستخدم وكلمة المرور" }, { status: 400 });
  }

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }

  const token = await createSessionToken(username);
  const res = NextResponse.json({ ok: true, username });
  const cookie = sessionCookieOptions(token);
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}
