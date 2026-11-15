"use client";

import { useMemo } from "react";
import { SectionBackground } from "./SectionBackground";
import { BG } from "./config";
import {
  useHasMounted,
  useIsMobileBg,
  usePrefersReducedMotion,
} from "./useSectionInView";

export function FooterBackground() {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobileBg();
  const animate = mounted && !reduced;
  const count = !mounted
    ? BG.footer.speckCountDesktop
    : mobile
      ? BG.footer.speckCountMobile
      : BG.footer.speckCountDesktop;

  const specks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${12 + ((i * 11) % 70)}%`,
        left: `${5 + ((i * 17) % 90)}%`,
        size: 1.5 + (i % 3),
        delay: `${(i * 0.55) % 5}s`,
        duration: `${2.4 + (i % 4) * 0.6}s`,
      })),
    [count],
  );

  return (
    <SectionBackground className="footer-bg">
      <svg
        className="footer-bg__wave"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{
          animationDuration: animate
            ? `${BG.footer.waveDurationSec}s`
            : undefined,
        }}
      >
        <path
          className="footer-bg__wave-path"
          d="M0,40 C180,70 360,10 540,40 C720,70 900,10 1080,40 C1260,70 1380,20 1440,40 L1440,0 L0,0 Z"
          fill="var(--cream)"
          opacity="0.08"
        />
        <path
          d="M0,48 C200,18 400,68 600,48 C800,28 1000,68 1200,48 C1320,38 1400,55 1440,48 L1440,0 L0,0 Z"
          fill="var(--caramel)"
          opacity="0.05"
        />
      </svg>

      <p
        className="footer-bg__wordmark"
        style={{ opacity: BG.footer.wordmarkOpacity }}
      >
        شلاش
      </p>

      {specks.map((s) => (
        <span
          key={s.id}
          className="footer-bg__speck"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: BG.footer.speckOpacity,
            animationDuration: animate ? s.duration : undefined,
            animationDelay: animate ? s.delay : undefined,
          }}
        />
      ))}
    </SectionBackground>
  );
}
