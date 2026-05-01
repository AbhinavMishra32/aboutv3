import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasSystemsAdminSession, isSystemsAdminConfigured } from "@/lib/systems-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  return NextResponse.json(
    {
      authenticated: hasSystemsAdminSession(cookieStore),
      configured: isSystemsAdminConfigured(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
