"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import type { BlogPostDraft } from "@/lib/blog-studio";
import { createBlogAsset, deleteStudioPost, upsertStudioPost } from "@/lib/blog-db";

export async function savePostAction(post: BlogPostDraft) {
  await requireAdmin("/studio");
  await upsertStudioPost(post);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
}

export async function deletePostAction(id: string, slug: string) {
  await requireAdmin("/studio");
  await deleteStudioPost(id);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
}

export async function uploadBlogImageAction({
  dataUrl,
  fileName,
}: {
  dataUrl: string;
  fileName: string;
}) {
  await requireAdmin("/studio");

  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/);
  if (!match) {
    throw new Error("Only PNG, JPG, WebP, and GIF images are supported.");
  }

  const [, mimeType, base64] = match;
  const data = Buffer.from(base64, "base64");

  if (data.length > 4 * 1024 * 1024) {
    throw new Error("Image is too large. Keep uploads under 4MB.");
  }

  const id = `asset_${randomUUID()}`;
  await createBlogAsset({
    id,
    fileName: fileName || id,
    mimeType,
    data,
  });

  return `/api/blog/assets/${id}`;
}
