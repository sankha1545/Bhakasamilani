// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAdminJwt, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signAdminJwt({
      adminId: admin.id,
      email: admin.email,
    });

    const res = NextResponse.json({ ok: true }, { status: 200 });

    // Set secure admin auth cookie on the response
    setAdminCookie(res, token);

    // Ensure login response is never cached
    res.headers.set("Cache-Control", "no-store");

    return res;
  } catch (err) {
    console.error("Admin login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
