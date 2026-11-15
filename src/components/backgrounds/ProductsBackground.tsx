"use client";

import { useMemo } from "react";
import { SectionBackground } from "./SectionBackground";
import { BG } from "./config";
import {
  useHasMounted,
  useIsMobileBg,
  usePrefersReducedMotion,
} from "./useSectionInView";

export function ProductsBackground() {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobileBg();
  const animate = mounted && !reduced;
  const count = !mounted
    ? 0
    : mobile
      ? BG.products.crumbCountMobile
      : BG.products.crumbCountDesktop;

  const crumbs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 17) % 84)}%`,
        delay: `${(i * 0.7) % 6}s`,
        duration: `${10 + (i % 5)}s`,
        size: 3 + (i % 4),
      })),
    [count],
  );

  return (
    <SectionBackground className="products-bg">
      <div
        className="products-bg__biscuit"
        style={{
          opacity: BG.products.patternOpacity,
          animationDuration: animate
            ? `${BG.products.patternDriftSec}s`
            : undefined,
        }}
      />
      {animate && (
        <div
          className="products-bg__beam"
          style={{ animationDuration: `${BG.products.beamDurationSec}s` }}
        />
      )}
      {animate &&
        crumbs.map((c) => (
          <span
            key={c.id}
            className="products-bg__crumb"
            style={{
              left: c.left,
              width: c.size,
              height: c.size,
              opacity: BG.products.crumbOpacity,
              animationDelay: c.delay,
              animationDuration: c.duration,
            }}
          />
        ))}
    </SectionBackground>
  );
}
