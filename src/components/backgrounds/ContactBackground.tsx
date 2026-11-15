"use client";

import { useEffect, useMemo, useRef } from "react";
import { SectionBackground } from "./SectionBackground";
import { BG } from "./config";
import {
  useHasMounted,
  useIsMobileBg,
  usePrefersReducedMotion,
} from "./useSectionInView";

export function ContactBackground() {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobileBg();
  const animate = mounted && !reduced;
  const layerRef = useRef<HTMLDivElement>(null);
  const shapeCount = !mounted
    ? BG.contact.shapeCountDesktop
    : mobile
      ? BG.contact.shapeCountMobile
      : BG.contact.shapeCountDesktop;
  const bubbleCount = !mounted
    ? 0
    : mobile
      ? BG.contact.bubbleCountMobile
      : BG.contact.bubbleCountDesktop;

  const shapes = useMemo(
    () =>
      Array.from({ length: shapeCount }, (_, i) => ({
        id: i,
        top: `${10 + ((i * 17) % 70)}%`,
        left: `${8 + ((i * 23) % 80)}%`,
        size: 48 + ((i * 19) % 70),
        round: i % 2 === 0,
        duration: `${28 + i * 4}s`,
        delay: `${i * 1.2}s`,
      })),
    [shapeCount],
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: bubbleCount }, (_, i) => ({
        id: i,
        left: `${12 + ((i * 19) % 76)}%`,
        delay: `${i * 2.4}s`,
        duration: `${16 + i * 3}s`,
        scale: 0.7 + (i % 3) * 0.15,
      })),
    [bubbleCount],
  );

  useEffect(() => {
    if (!animate || mobile) return;
    const layer = layerRef.current;
    if (!layer) return;

    const section = layer.closest("section");
    if (!section) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        const px = -x * BG.contact.mouseParallax;
        const py = -y * BG.contact.mouseParallax;
        layer.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
      });
    };

    section.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("mousemove", onMove);
    };
  }, [animate, mobile]);

  return (
    <SectionBackground className="contact-bg">
      <div
        className="contact-bg__gradient"
        style={{
          animationDuration: animate
            ? `${BG.contact.gradientDurationSec}s`
            : undefined,
        }}
      />
      <div ref={layerRef} className="contact-bg__shapes">
        {shapes.map((s) => (
          <span
            key={s.id}
            className={
              s.round ? "contact-bg__shape contact-bg__shape--circle" : "contact-bg__shape"
            }
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              opacity: BG.contact.shapeOpacity,
              animationDuration: animate ? s.duration : undefined,
              animationDelay: animate ? s.delay : undefined,
            }}
          />
        ))}
      </div>
      {animate &&
        bubbles.map((b) => (
          <span
            key={b.id}
            className="contact-bg__bubble"
            style={{
              left: b.left,
              opacity: BG.contact.bubbleOpacity,
              animationDelay: b.delay,
              animationDuration: b.duration,
              transform: `scale(${b.scale})`,
            }}
          />
        ))}
    </SectionBackground>
  );
}
