import { NextResponse } from "next/server";
import { getPostViews, incrementPostViews } from "@/lib/blog-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const views = await getPostViews(slug);
  return NextResponse.json({ views });
}

export async function POST(request: Request) {
  const body = await request.json();
  const slug = body?.slug as string | undefined;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const views = await incrementPostViews(slug);
  return NextResponse.json({ views });
}
