import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/cms/auth-token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";
  const isCmsApi = pathname.startsWith("/api/cms");
  const isAuthLogin = pathname === "/api/cms/auth/login";

  if (isAuthLogin || isLogin) return NextResponse.next();
  if (!isAdminPage && !isCmsApi) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    if (isCmsApi) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/cms/:path*"],
};
