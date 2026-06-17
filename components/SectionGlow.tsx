"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export interface GlowLayerConfig {
  background: string;
  opacity?: number;
  /** Pixels of vertical drift across the section's scroll range. */
  parallax?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
}

function GlowLayer({
  background,
  opacity = 1,
  parallax = 0,
  mixBlendMode,
  scrollYProgress,
}: GlowLayerConfig & { scrollYProgress: MotionValue<number> }) {
  const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax]);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "-12%",
        bottom: "-12%",
        left: 0,
        right: 0,
        background,
        opacity,
        mixBlendMode,
        y,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Layered radial/linear gradient backdrop with subtle per-layer parallax,
 * used to give each section its own atmosphere while letting colors
 * bleed gently into the sections above and below.
 */
export function SectionGlow({ layers }: { layers: GlowLayerConfig[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {layers.map((layer, i) => (
        <GlowLayer key={i} {...layer} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}
