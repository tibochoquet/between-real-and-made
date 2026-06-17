"use client";

import { motion } from "framer-motion";

export interface WaveLayer {
  color: string;
  amplitude: number;    // 0–50 in normalized units (viewBox height = 100)
  period: number;       // px in 1440-wide space; must evenly divide 1440
  speed: number;        // seconds per full loop
  strokeWidth?: number;
  direction?: 1 | -1;  // 1 = rightward scroll (default), -1 = leftward
  yCenter?: number;     // 0–100, default 50
  filled?: boolean;     // fill below the wave line
  fillOpacity?: number; // fill opacity when filled=true, default 0.06
}

function buildWavePath(
  midY: number,
  amplitude: number,
  period: number,
  filled: boolean
): string {
  const totalWidth = 2880;
  const half = period / 2;
  const cp = half * 0.3642;
  let d = `M 0 ${midY}`;
  let up = true;

  for (let x = 0; x < totalWidth; x += half) {
    const peak = up ? midY - amplitude : midY + amplitude;
    const nx = x + half;
    d += ` C ${+(x + cp).toFixed(1)} ${peak} ${+(nx - cp).toFixed(1)} ${peak} ${+nx.toFixed(1)} ${midY}`;
    up = !up;
  }

  if (filled) {
    d += ` L 2880 100 L 0 100 Z`;
  }

  return d;
}

export function AnimatedWaveform({
  layers,
  verticalFade = false,
}: {
  layers: WaveLayer[];
  verticalFade?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={
        verticalFade
          ? { maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)" }
          : undefined
      }
      aria-hidden="true"
    >
      {layers.map((layer, i) => {
        const dir = layer.direction ?? 1;
        const from = dir === 1 ? "0%" : "-50%";
        const to = dir === 1 ? "-50%" : "0%";
        const path = buildWavePath(layer.yCenter ?? 50, layer.amplitude, layer.period, layer.filled ?? false);

        return (
          <motion.div
            key={i}
            className="absolute inset-y-0 left-0"
            style={{ width: "200%" }}
            animate={{ x: [from, to] }}
            transition={{
              duration: layer.speed,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <svg
              viewBox="0 0 2880 100"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              {layer.filled ? (
                <path
                  d={path}
                  fill={layer.color}
                  fillOpacity={layer.fillOpacity ?? 0.06}
                  stroke="none"
                />
              ) : (
                <path
                  d={path}
                  fill="none"
                  stroke={layer.color}
                  strokeWidth={layer.strokeWidth ?? 1.5}
                />
              )}
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
