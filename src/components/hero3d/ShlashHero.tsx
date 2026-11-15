"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ASSETS, PIN_VH } from "./timeline";
import { Overlay } from "./Overlay";
import {
  useScrollTimeline,
  type TimelineDrivers,
} from "./useScrollTimeline";

const ShlashScene = dynamic(
  () =>
    import("./ShlashScene").then((m) => m.ShlashScene),
  { ssr: false, loading: () => <HeroBootSplash /> },
);

function HeroBootSplash() {
  return (
    <div className="hero3d-loader hero3d-loader--boot" role="status">
      <div className="hero3d-loader__mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/shlash_primary_logo_transparent.png"
          alt=""
          width={120}
          height={132}
        />
      </div>
      <p className="hero3d-loader__brand">شلاش</p>
    </div>
  );
}

function ReducedMotionHero() {
  return (
    <section
      id="story"
      className="hero3d hero3d--reduced"
      aria-label="شلاش — ساحة التوزيع"
    >
      <div className="hero3d__sticky">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero3d__poster"
          src={ASSETS.poster}
          alt="شلاش — ساحة تحميل المستودع"
        />
        <video
          className="hero3d__fallback-video"
          src={ASSETS.fallbackVideo}
          poster={ASSETS.poster}
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
        />
        <div className="hero3d-overlay__veil" aria-hidden />
        <div className="hero3d-overlay__title-wrap">
          <h1 className="hero3d-overlay__title">شلاش</h1>
          <p className="hero3d-overlay__role">موزّع غذائي موثوق</p>
        </div>
        <div className="hero3d-overlay__cta" style={{ opacity: 1 }}>
          <a href="#products" className="hero3d-overlay__cta-btn">
            استكشف المنتجات
          </a>
        </div>
      </div>
    </section>
  );
}

export function ShlashHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const driversRef = useRef<TimelineDrivers>({
    camera: null,
    cameraTarget: new THREE.Vector3(0.4, 1, 0),
    truck: null,
    worker: null,
    boxes: null,
    setDust: () => undefined,
    setFocus: () => undefined,
  });

  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useGltf, setUseGltf] = useState(false);
  const [overlay, setOverlay] = useState({
    progress: 0,
    titleVisible: true,
    ctaVisible: false,
  });

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      setReduced(mqMotion.matches);
      setIsMobile(mqMobile.matches || navigator.hardwareConcurrency <= 4);
    };
    apply();
    mqMotion.addEventListener("change", apply);
    mqMobile.addEventListener("change", apply);
    return () => {
      mqMotion.removeEventListener("change", apply);
      mqMobile.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(ASSETS.truck, { method: "HEAD" }).then((r) => r.ok),
      fetch(ASSETS.worker, { method: "HEAD" }).then((r) => r.ok),
    ])
      .then(([truck, worker]) => {
        if (!cancelled) setUseGltf(truck && worker);
      })
      .catch(() => {
        if (!cancelled) setUseGltf(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onOverlay = useCallback(
    (s: { progress: number; titleVisible: boolean; ctaVisible: boolean }) => {
      setOverlay((prev) => {
        if (
          Math.abs(prev.progress - s.progress) < 0.001 &&
          prev.titleVisible === s.titleVisible &&
          prev.ctaVisible === s.ctaVisible
        ) {
          return prev;
        }
        return s;
      });
    },
    [],
  );

  useScrollTimeline(sectionRef, driversRef, onOverlay);

  if (reduced) return <ReducedMotionHero />;

  return (
    <section
      ref={sectionRef}
      id="story"
      className="hero3d"
      style={{ height: `${PIN_VH}vh` }}
      aria-label="تشغيل التوزيع ثلاثي الأبعاد"
    >
      <div className="hero3d__sticky">
        <ShlashScene
          driversRef={driversRef}
          isMobile={isMobile}
          useGltf={useGltf}
        />
        <Overlay
          progress={overlay.progress}
          titleVisible={overlay.titleVisible}
          ctaVisible={overlay.ctaVisible}
        />
      </div>
    </section>
  );
}
