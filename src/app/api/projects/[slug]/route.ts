import { NextResponse } from "next/server";
import { getRepoDetail } from "@/lib/github";
import { PROJECTS } from "@/lib/portfolio";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  const { slug } = await context.params;
  const project = PROJECTS.find((entry) => entry.slug === slug);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (!project.repo) {
    return NextResponse.json({ error: "Project does not have a public repo timeline" }, { status: 404 });
  }

  try {
    const detail = await getRepoDetail(project.slug, project.repo);
    return NextResponse.json(detail);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to fetch project repository detail",
      },
      { status: 500 }
    );
  }
}
