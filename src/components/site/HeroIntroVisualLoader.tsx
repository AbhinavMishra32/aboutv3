"use client";

import dynamic from "next/dynamic";

const LazyHeroIntroVisual = dynamic(
  () => import("@/components/site/HeroIntroVisual").then((module) => module.HeroIntroVisual),
  {
    ssr: false,
    loading: () => (
      <div className="hero-intro-visual hero-intro-visual-fallback" aria-hidden="true">
        <div className="hero-intro-grid" />
      </div>
    ),
  }
);

export function HeroIntroVisualLoader() {
  return <LazyHeroIntroVisual />;
}
