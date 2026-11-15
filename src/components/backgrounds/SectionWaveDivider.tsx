"use client";

import { BG } from "./config";
import { useHasMounted, usePrefersReducedMotion } from "./useSectionInView";
import "./section-backgrounds.css";

type Tone = "cream" | "choco" | "ice" | "white" | "navy" | "blue";

const fillVar: Record<Tone, string> = {
  cream: "var(--cream)",
  choco: "var(--choco)",
  ice: "var(--ice)",
  white: "#ffffff",
  navy: "var(--navy)",
  blue: "var(--blue)",
};

type Props = {
  /** Color of the section above (fills the wave body) */
  from: Tone;
  /** Color of the section below (page shows through; used for seam matching) */
  to: Tone;
  flip?: boolean;
  className?: string;
};

/**
 * Curved SVG seam between sections. `from` paints the wave so it matches
 * the section above; place the divider at the boundary with negative margin
 * or as the first child of the lower section.
 */
export function SectionWaveDivider({ from, to, flip, className }: Props) {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const animate = mounted && !reduced;

  return (
    <div
      className={`section-wave ${flip ? "section-wave--flip" : ""} ${className ?? ""}`}
      style={{
        color: fillVar[from],
        background: fillVar[to],
        height: BG.wave.height,
      }}
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
          d="M0,48 C120,70 240,20 360,42 C480,64 600,18 720,40 C840,62 960,22 1080,44 C1200,66 1320,28 1440,50 L1440,0 L0,0 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
