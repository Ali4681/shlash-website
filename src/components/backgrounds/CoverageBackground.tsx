"use client";

import { SectionBackground } from "./SectionBackground";
import { BG } from "./config";
import {
  useHasMounted,
  useIsMobileBg,
  usePrefersReducedMotion,
} from "./useSectionInView";

/** Soft topo + radar only — flight lines live on the map→legend overlay. */
export function CoverageBackground() {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobileBg();
  const animate = mounted && !reduced;
  const rings = !mounted
    ? BG.coverage.ringCountDesktop
    : mobile
      ? BG.coverage.ringCountMobile
      : BG.coverage.ringCountDesktop;

  return (
    <SectionBackground className="coverage-bg">
      <div
        className="coverage-bg__topo"
        style={{
          opacity: BG.coverage.topoOpacity,
          animationDuration: animate
            ? `${BG.coverage.topoBreathSec}s`
            : undefined,
          ["--topo-scale" as string]: BG.coverage.topoBreathScale,
        }}
      >
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className="coverage-bg__topo-svg"
        >
          {[80, 140, 200, 260, 320, 380, 440].map((cy, i) => (
            <ellipse
              key={cy}
              cx="400"
              cy={cy}
              rx={280 + i * 18}
              ry={55 + i * 8}
              fill="none"
              stroke="var(--cream)"
              strokeWidth="1"
              opacity={0.55 - i * 0.05}
            />
          ))}
          {[120, 220, 320, 420, 520, 620, 700].map((cx, i) => (
            <path
              key={cx}
              d={`M ${cx} 40 Q ${cx + (i % 2 ? 40 : -40)} 250 ${cx} 460`}
              fill="none"
              stroke="var(--cream)"
              strokeWidth="1"
              opacity={0.35}
            />
          ))}
        </svg>
      </div>

      <div className="coverage-bg__radar" style={{ opacity: BG.coverage.ringOpacity }}>
        {Array.from({ length: rings }, (_, i) => (
          <span
            key={i}
            className="coverage-bg__ring"
            style={{
              animationDuration: animate
                ? `${BG.coverage.ringDurationSec}s`
                : undefined,
              animationDelay: animate ? `${i * 2.2}s` : undefined,
            }}
          />
        ))}
      </div>
    </SectionBackground>
  );
}
