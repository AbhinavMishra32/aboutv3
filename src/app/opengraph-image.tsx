import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/site";

export const alt = "Abhinav Mishra — Full-stack engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Site-wide share card, in the same ruled-column language as the pages. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#f5f5f4",
          padding: "72px 80px",
          borderLeft: "1px dashed rgba(255,255,255,0.14)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#6c6c74", letterSpacing: 2 }}>
          <span>ABHINAVMISHRA.IN</span>
          <span>{PROFILE.location.toUpperCase()}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, lineHeight: 1, letterSpacing: -2 }}>{PROFILE.name}</div>
          <div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 26, maxWidth: 880, lineHeight: 1.4 }}>
            Full-stack engineer. I own BRAINER at Lunacal.ai — autonomous
            agents running six company functions in Kubernetes sandboxes.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 20, color: "#6c6c74", letterSpacing: 1 }}>
          <span>NESTJS</span>
          <span>·</span>
          <span>NEXT.JS</span>
          <span>·</span>
          <span>KUBERNETES</span>
          <span>·</span>
          <span>AGENT INFRASTRUCTURE</span>
        </div>
      </div>
    ),
    size
  );
}
