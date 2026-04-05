import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import { ENV } from "./env";
import { parse as parseCookieHeader } from "cookie";

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.length > 0;

type SessionPayload = {
  sub: string; // google user id
  appId: string;
  name: string;
  email: string | null;
};

function getJwtSecret() {
  if (!ENV.cookieSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(ENV.cookieSecret);
}

export async function signSession(payload: SessionPayload, options: { expiresInMs?: number } = {}) {
  const issuedAt = Date.now();
  const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
  const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
  const secretKey = getJwtSecret();

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(secretKey);
}

export async function verifySession(token: string | undefined | null) {
  if (!token) return null;
  const secretKey = getJwtSecret();
  const { payload } = await jwtVerify(token, secretKey, { algorithms: ["HS256"] });
  const { sub, appId, name, email } = payload as Record<string, unknown>;
  if (!isNonEmptyString(sub) || !isNonEmptyString(appId) || !isNonEmptyString(name)) return null;
  return { sub, appId, name, email: typeof email === "string" ? email : null };
}

export function parseCookie(header: string | undefined) {
  if (!header) return new Map<string, string>();
  const parsed = parseCookieHeader(header);
  return new Map<string, string>(Object.entries(parsed));
}

export async function authenticateRequest(req: Request) {
  // 1) Authorization: Bearer <token>
  const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    return verifySession(token);
  }

  // 2) Cookie
  const cookies = parseCookie(req.headers.cookie as string | undefined);
  const cookieToken = cookies.get(COOKIE_NAME);
  return verifySession(cookieToken);
}
