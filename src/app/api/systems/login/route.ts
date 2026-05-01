import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getSystemsAdminSessionToken,
  isSystemsAdminConfigured,
  SYSTEMS_ADMIN_COOKIE,
  verifySystemsPassword,
} from "@/lib/systems-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSystemsAdminConfigured()) {
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 503 });
  }

  const { password } = (await request.json()) as { password?: string };
  if (!password || !verifySystemsPassword(password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = getSystemsAdminSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 503 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SYSTEMS_ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return NextResponse.json({ ok: true });
}
