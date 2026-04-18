import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const TOKEN_NAME = "token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

interface TokenPayload {
  userId: string;
  email: string;
  role: "employer" | "employee";
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

export async function getSession(): Promise<TokenPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}

export function tokenCookieOptions(): string {
  return `${TOKEN_NAME}={token}; HttpOnly; Path=/; Max-Age=${TOKEN_MAX_AGE}; SameSite=Lax`;
}

export function clearCookieOptions(): string {
  return `${TOKEN_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
