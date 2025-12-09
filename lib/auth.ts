// lib/auth.ts
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const ADMIN_JWT_COOKIE = "admin_token";

export type AdminJwtPayload = {
  adminId: string;
  email: string;
  iat?: number;
  exp?: number;
};

export function signAdminJwt(payload: AdminJwtPayload) {
  if (!process.env.ADMIN_JWT_SECRET) {
    throw new Error("ADMIN_JWT_SECRET not set");
  }

  return jwt.sign(payload, process.env.ADMIN_JWT_SECRET, {
    expiresIn: "1d",
  });
}

// Set the admin auth cookie (Next.js App Router safe)
export function setAdminCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: ADMIN_JWT_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
}

// Clear the admin cookie (logout)
export function clearAdminCookie(res: NextResponse) {
  res.cookies.set({
    name: ADMIN_JWT_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

// Verify JWT from cookie/token string
export function verifyAdminJwt(token: string | null | undefined) {
  if (!token) return null;

  if (!process.env.ADMIN_JWT_SECRET) {
    throw new Error("ADMIN_JWT_SECRET not set");
  }

  try {
    return jwt.verify(token, process.env.ADMIN_JWT_SECRET) as AdminJwtPayload;
  } catch (err) {
    return null;
  }
}

// Extract admin from Request cookies (for Route Handlers)
export function getAdminFromRequest(req: Request): AdminJwtPayload | null {
  try {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookiesObj = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [key, ...rest] = c.trim().split("=");
        return [key, rest.join("=")];
      })
    );

    const token = cookiesObj[ADMIN_JWT_COOKIE];
    if (!token) return null;

    return verifyAdminJwt(token);
  } catch (err) {
    return null;
  }
}

// 🔐 Extract admin from server-side cookies() (for layouts/pages in app router)
export async function getCurrentAdmin(): Promise<AdminJwtPayload | null> {
  try {
    // ⬅️ IMPORTANT: cookies() is async now, so we await it
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_JWT_COOKIE)?.value;
    return verifyAdminJwt(token);
  } catch {
    return null;
  }
}
