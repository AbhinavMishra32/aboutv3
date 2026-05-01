import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasSystemsAdminSession } from "@/lib/systems-auth";
import { getSystemsTimeline } from "@/lib/systems";
import { saveSystemsOverride, type SystemsOverrideRecord } from "@/lib/systems-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getSystemsTimeline();
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!hasSystemsAdminSession(cookieStore)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Partial<SystemsOverrideRecord>;

  if (!payload.slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const record: SystemsOverrideRecord = {
    slug: payload.slug,
    status: payload.status ?? null,
    phase: payload.phase ?? null,
    summary: payload.summary ?? null,
    latestMilestone: payload.latestMilestone ?? null,
    words: payload.words ?? null,
    nextStep: payload.nextStep ?? null,
    updatedAt: payload.updatedAt ?? null,
    learningFocus: payload.learningFocus ?? null,
  };

  try {
    await saveSystemsOverride(record);
    const items = await getSystemsTimeline();
    return NextResponse.json({ ok: true, items }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save system timeline entry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
