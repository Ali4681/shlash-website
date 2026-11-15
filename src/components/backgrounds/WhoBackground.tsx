"use client";

import { useEffect, useRef } from "react";
import { SectionBackground } from "./SectionBackground";
import { BG } from "./config";
import { useHasMounted, usePrefersReducedMotion } from "./useSectionInView";

export function WhoBackground() {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const animate = mounted && !reduced;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) return;
    const grid = gridRef.current;
    if (!grid) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const section = grid.closest("section");
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const viewH = window.innerHeight || 1;
        const t = 1 - (rect.top + rect.height) / (viewH + rect.height);
        const y = (t - 0.5) * BG.who.gridParallax;
        grid.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [animate]);

  const { blobOpacity, blobDurations, gridOpacity } = BG.who;

  return (
    <SectionBackground className="who-bg">
      <div
        className="who-bg__blob who-bg__blob--a"
        style={{
          opacity: blobOpacity,
          animationDuration: animate ? `${blobDurations[0]}s` : undefined,
        }}
      />
      <div
        className="who-bg__blob who-bg__blob--b"
        style={{
          opacity: blobOpacity * 0.9,
          animationDuration: animate ? `${blobDurations[1]}s` : undefined,
        }}
      />
      <div
        className="who-bg__blob who-bg__blob--c"
        style={{
          opacity: blobOpacity * 0.75,
          animationDuration: animate ? `${blobDurations[2]}s` : undefined,
        }}
      />
      <div
        ref={gridRef}
        className="who-bg__grid"
        style={{ opacity: gridOpacity }}
      />
    </SectionBackground>
  );
}
