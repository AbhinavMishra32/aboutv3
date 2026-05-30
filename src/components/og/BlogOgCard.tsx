import type { CSSProperties } from "react";

type BlogOgCardProps = {
  title: string;
  eyebrow?: string;
  summary: string;
  date?: string;
  tags?: string[];
  variant?: "index" | "post";
};

const muted = "#6f7177";
const ink = "#171719";
const line = "#dedee3";

function clampText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function formatDate(value?: string) {
  if (!value) return "Writing";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function SkylineBars() {
  const bars = [
    { height: 86, width: 30, radius: 16 },
    { height: 132, width: 42, radius: 18 },
    { height: 104, width: 34, radius: 17 },
    { height: 176, width: 52, radius: 24 },
    { height: 118, width: 36, radius: 18 },
    { height: 148, width: 44, radius: 22 },
    { height: 92, width: 30, radius: 16 },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 14,
        height: 196,
        opacity: 0.9,
      }}
    >
      {bars.map((bar, index) => (
        <div
          key={`${bar.height}-${index}`}
          style={{
            display: "flex",
            width: bar.width,
            height: bar.height,
            border: "1px solid rgba(23, 23, 25, 0.12)",
            borderRadius: `${bar.radius}px ${bar.radius}px 10px 10px`,
            background:
              index % 2 === 0
                ? "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(232,233,236,0.78))"
                : "linear-gradient(180deg, rgba(245,245,247,0.98), rgba(213,216,221,0.7))",
            boxShadow: "0 18px 42px rgba(24, 27, 32, 0.08)",
          }}
        />
      ))}
    </div>
  );
}

function ContributionField() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        width: 312,
        padding: 20,
        border: "1px solid rgba(23, 23, 25, 0.1)",
        borderRadius: 30,
        background: "rgba(255, 255, 255, 0.58)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.86)",
      }}
    >
      {Array.from({ length: 42 }).map((_, index) => {
        const active = [2, 3, 8, 9, 10, 16, 17, 22, 24, 29, 30, 31, 37].includes(index);
        return (
          <div
            key={index}
            style={{
              display: "flex",
              width: 24,
              height: 24,
              borderRadius: 8,
              background: active
                ? "linear-gradient(135deg, rgba(32, 116, 220, 0.8), rgba(19, 176, 125, 0.72))"
                : "rgba(23, 23, 25, 0.055)",
              boxShadow: active ? "0 8px 18px rgba(32, 116, 220, 0.18)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

const pillStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: 42,
  padding: "0 18px",
  border: "1px solid rgba(23, 23, 25, 0.11)",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.66)",
  color: muted,
  fontSize: 22,
  letterSpacing: "-0.02em",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.88)",
};

export function BlogOgCard({
  title,
  eyebrow = "Writing",
  summary,
  date,
  tags = [],
  variant = "post",
}: BlogOgCardProps) {
  const visibleTags = tags.slice(0, 3);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "1200px",
        height: "630px",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 82% 18%, rgba(64, 136, 255, 0.18), transparent 260px), radial-gradient(circle at 74% 82%, rgba(36, 190, 132, 0.15), transparent 260px), linear-gradient(135deg, #fbfbfc 0%, #f0f1f4 58%, #e6e8ec 100%)",
        color: ink,
        fontFamily: "sans serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient(rgba(23,23,25,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,25,0.035) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 56,
          top: 68,
          display: "flex",
          width: 412,
          height: 492,
          border: "1px solid rgba(23, 23, 25, 0.1)",
          borderRadius: 44,
          background: "rgba(255, 255, 255, 0.44)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.86), 0 34px 96px rgba(24,27,32,0.12)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 92,
          top: 112,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <ContributionField />
        <SkylineBars />
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "60px 570px 56px 64px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                width: 42,
                height: 42,
                borderRadius: 14,
                background: "linear-gradient(135deg, #161719, #42454c)",
                boxShadow: "0 16px 36px rgba(23,23,25,0.18)",
              }}
            />
            <div style={{ ...pillStyle, color: ink, fontWeight: 700 }}>Abhinav Mishra</div>
            <div style={pillStyle}>{eyebrow}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                color: muted,
                fontSize: 24,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {variant === "index" ? "Blog index" : formatDate(date)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: title.length > 34 ? 58 : 66,
                fontWeight: 760,
                letterSpacing: "-0.065em",
                lineHeight: 0.94,
              }}
            >
              {clampText(title, 74)}
            </div>
            <div
              style={{
                display: "flex",
                color: "#3f4248",
                fontSize: 28,
                lineHeight: 1.32,
                letterSpacing: "-0.026em",
              }}
            >
              {clampText(summary, 150)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              width: 472,
              height: 2,
              borderRadius: 999,
              backgroundColor: line,
              opacity: 0.9,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {(visibleTags.length ? visibleTags : ["Portfolio", "Systems", "Product"]).map((tag) => (
              <div key={tag} style={pillStyle}>
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              color: muted,
              fontSize: 22,
              letterSpacing: "-0.02em",
            }}
          >
            abhinavmishra.in/blog
          </div>
        </div>
      </div>
    </div>
  );
}
