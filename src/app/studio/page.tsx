import type { Metadata } from "next";
import { BlobStudioClient } from "@/components/studio/BlobStudioClient";
import { PortfolioShell } from "@/components/site/PortfolioShell";
import { STUDIO_SEED_BLOBS } from "@/lib/blob-studio";

export const metadata: Metadata = {
  title: "Studio | Abhinav Mishra",
  description: "Create, edit, and publish rich portfolio blobs with markdown, embeds, and live update telemetry.",
};

export default function StudioPage() {
  return (
    <PortfolioShell active="studio" tagline="Create blobs, sync markdown, attach embeds, and keep the portfolio system live.">
      <BlobStudioClient initialBlobs={STUDIO_SEED_BLOBS} />
    </PortfolioShell>
  );
}

