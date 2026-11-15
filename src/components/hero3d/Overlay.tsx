"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HERO_STAGES, stageFromProgress } from "./timeline";

type Props = {
  progress: number;
  titleVisible: boolean;
  ctaVisible: boolean;
};

export function Overlay({ progress, titleVisible, ctaVisible }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const copyInnerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [stageIndex, setStageIndex] = useState(0);
  const stageIndexRef = useRef(0);
  const stage = HERO_STAGES[stageIndex];

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progress * 100}%`;
    }

    const next = stageFromProgress(progress);
    if (next !== stageIndexRef.current && copyInnerRef.current) {
      stageIndexRef.current = next;
      gsap
        .timeline()
        .to(copyInnerRef.current, {
          y: -10,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        })
        .add(() => setStageIndex(next))
        .fromTo(
          copyInnerRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.32, ease: "power3.out" },
        );
    }

    if (hintRef.current) {
      gsap.set(hintRef.current, {
        autoAlpha: progress < 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.08),
      });
    }
  }, [progress]);

  useEffect(() => {
    if (!titleRef.current || !maskRef.current) return;
    gsap.to(maskRef.current, {
      clipPath: titleVisible
        ? "inset(0% 0% 0% 0%)"
        : "inset(0% 0% 100% 0%)",
      duration: 0.55,
      ease: "power3.inOut",
    });
    gsap.to(titleRef.current, {
      autoAlpha: titleVisible ? 1 : 0,
      y: titleVisible ? 0 : 24,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [titleVisible]);

  useEffect(() => {
    if (!ctaRef.current) return;
    gsap.to(ctaRef.current, {
      autoAlpha: ctaVisible ? 1 : 0,
      y: ctaVisible ? 0 : 20,
      duration: 0.55,
      ease: "power3.out",
    });
  }, [ctaVisible]);

  return (
    <div className="hero3d-overlay" aria-hidden={false}>
      <div className="hero3d-overlay__veil" aria-hidden />

      <div className="hero3d-overlay__title-wrap">
        <div
          ref={maskRef}
          className="hero3d-overlay__title-mask"
          style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        >
          <h1 ref={titleRef} className="hero3d-overlay__title">
            شلاش
          </h1>
        </div>
        <p className="hero3d-overlay__role">موزّع غذائي موثوق</p>
      </div>

      <div className="hero3d-overlay__copy" aria-live="polite">
        <div ref={copyInnerRef}>
          <p className="hero3d-overlay__index font-en" dir="ltr">
            {stage.index}/{String(HERO_STAGES.length).padStart(2, "0")}
          </p>
          <h2 className="hero3d-overlay__stage">{stage.title}</h2>
          <p className="hero3d-overlay__line">{stage.line}</p>
        </div>
      </div>

      <div ref={ctaRef} className="hero3d-overlay__cta" style={{ opacity: 0 }}>
        <p className="hero3d-overlay__cta-kicker font-en">Shlash Distribution</p>
        <a href="#products" className="hero3d-overlay__cta-btn">
          استكشف المنتجات
        </a>
      </div>

      <p ref={hintRef} className="hero3d-overlay__hint font-en">
        Scroll
      </p>

      <div className="hero3d-overlay__progress" aria-hidden>
        <span ref={progressRef} />
      </div>
    </div>
  );
}
