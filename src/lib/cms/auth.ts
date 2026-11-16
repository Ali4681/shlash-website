import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  MAX_AGE_SEC,
  createSessionToken,
  verifyAdminCredentials,
  verifySessionToken,
} from "@/lib/cms/auth-token";

export {
  COOKIE_NAME,
  MAX_AGE_SEC,
  createSessionToken,
  verifyAdminCredentials,
  verifySessionToken,
};

export async function getCmsSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE_NAME)?.value);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export function clearSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
