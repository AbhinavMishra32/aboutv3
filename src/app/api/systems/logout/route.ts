import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SYSTEMS_ADMIN_COOKIE } from "@/lib/systems-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(SYSTEMS_ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
