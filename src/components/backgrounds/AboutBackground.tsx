"use client";

import { useEffect, useMemo, useRef } from "react";
import { SectionBackground } from "./SectionBackground";
import { BG } from "./config";
import {
  useHasMounted,
  useIsMobileBg,
  usePrefersReducedMotion,
} from "./useSectionInView";

export function AboutBackground() {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobileBg();
  const animate = mounted && !reduced;
  const glowRef = useRef<HTMLDivElement>(null);
  const count = !mounted
    ? 0
    : mobile
      ? BG.about.particleCountMobile
      : BG.about.particleCountDesktop;

  const particles = useMemo(() => {
    const { particleDurationMin, particleDurationMax } = BG.about;
    return Array.from({ length: count }, (_, i) => {
      const t =
        particleDurationMin +
        ((i * 3) % (particleDurationMax - particleDurationMin + 1));
      return {
        id: i,
        left: `${6 + ((i * 13) % 88)}%`,
        size: 8 + ((i * 5) % 28),
        delay: `${(i * 1.1) % 10}s`,
        duration: `${t}s`,
        opacity: BG.about.particleOpacity * (0.55 + (i % 5) * 0.09),
      };
    });
  }, [count]);

  useEffect(() => {
    if (!animate) return;
    const glow = glowRef.current;
    if (!glow) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const section = glow.closest("section");
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const viewH = window.innerHeight || 1;
        const t = 1 - (rect.top + rect.height * 0.35) / (viewH + rect.height);
        const y = (t - 0.5) * BG.about.glowParallax;
        glow.style.transform = `translate3d(-10%, ${y.toFixed(2)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [animate]);

  return (
    <SectionBackground className="about-bg">
      <div
        ref={glowRef}
        className="about-bg__glow"
        style={{ opacity: BG.about.glowOpacity }}
      />
      {animate &&
        particles.map((p) => (
          <span
            key={p.id}
            className="about-bg__particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      <div
        className="about-bg__grain"
        style={{ opacity: BG.about.grainOpacity }}
      />
    </SectionBackground>
  );
}
