import { NextResponse } from "next/server";
import { getBlogAsset } from "@/lib/blog-db";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await getBlogAsset(id);

  if (!asset) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(asset.data), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": asset.mime_type,
    },
  });
}
