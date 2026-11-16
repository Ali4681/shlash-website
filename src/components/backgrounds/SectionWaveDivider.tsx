"use client";

import type { CSSProperties } from "react";
import { BG } from "./config";
import { useHasMounted, usePrefersReducedMotion } from "./useSectionInView";
import "./section-backgrounds.css";

type Tone = "cream" | "choco" | "ice" | "white" | "navy" | "blue";

/**
 * Section surface tokens — separate from text remaps like --navy in dark mode.
 * Light + dark values live in globals.css as --section-*.
 */
const fillVar: Record<Tone, string> = {
  cream: "var(--section-cream)",
  choco: "var(--section-choco)",
  ice: "var(--section-ice)",
  white: "var(--section-white)",
  navy: "var(--section-navy)",
  blue: "var(--section-blue)",
};

type Props = {
  /** Color of the section above (fills the wave body) */
  from: Tone;
  /** Color of the section below (wave trough / seam base) */
  to: Tone;
  flip?: boolean;
  className?: string;
};

/**
 * Curved SVG seam between sections. Uses --section-* so light and dark
 * both get matching surfaces (never raw #fff / remapped text navy).
 */
export function SectionWaveDivider({ from, to, flip, className }: Props) {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const animate = mounted && !reduced;

  return (
    <div
      className={`section-wave ${flip ? "section-wave--flip" : ""} ${className ?? ""}`}
      data-from={from}
      data-to={to}
      style={
        {
          ["--wave-from"]: fillVar[from],
          ["--wave-to"]: fillVar[to],
          height: BG.wave.height,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <svg
        className="section-wave__svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{
          animationDuration: animate ? `${BG.wave.durationSec}s` : undefined,
        }}
      >
        <path
          className="section-wave__fill"
          d="M0,48 C120,70 240,20 360,42 C480,64 600,18 720,40 C840,62 960,22 1080,44 C1200,66 1320,28 1440,50 L1440,0 L0,0 Z"
        />
        <path
          className="section-wave__edge"
          d="M0,48 C120,70 240,20 360,42 C480,64 600,18 720,40 C840,62 960,22 1080,44 C1200,66 1320,28 1440,50"
          fill="none"
        />
      </svg>
    </div>
  );
}
