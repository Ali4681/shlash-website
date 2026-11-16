const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret() {
  const secret = process.env.CMS_SESSION_SECRET;
  if (!secret) throw new Error("CMS_SESSION_SECRET is not set");
  return secret;
}

function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i += 1) binary += String.fromCharCode(arr[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

async function hmacSign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(sig);
}

function timingSafeEqualStr(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function createSessionToken(username: string, maxAgeSec = 60 * 60 * 24 * 7) {
  const exp = Date.now() + maxAgeSec * 1000;
  const body = bytesToBase64Url(encoder.encode(JSON.stringify({ u: username, exp })));
  const sig = await hmacSign(body);
  return `${body}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await hmacSign(body);
  if (!timingSafeEqualStr(sig, expected)) return null;
  try {
    const data = JSON.parse(decoder.decode(base64UrlToBytes(body))) as {
      u: string;
      exp: number;
    };
    if (!data?.u || !data?.exp || Date.now() > data.exp) return null;
    return { username: data.u };
  } catch {
    return null;
  }
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.CMS_ADMIN_USER ?? "";
  const expectedPass = process.env.CMS_ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  return timingSafeEqualStr(username, expectedUser) && timingSafeEqualStr(password, expectedPass);
}

export const COOKIE_NAME = "shlash_cms_session";
export const MAX_AGE_SEC = 60 * 60 * 24 * 7;
