"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

type Props = {
  onReady?: () => void;
};

export function Loader({ onReady }: Props) {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay((d) => d + (progress - d) * 0.25);
  }, [progress]);

  useEffect(() => {
    if (!active && progress >= 100) {
      const t = window.setTimeout(() => {
        setVisible(false);
        onReady?.();
      }, 420);
      return () => window.clearTimeout(t);
    }
  }, [active, progress, onReady]);

  if (!visible) return null;

  const pct = Math.min(100, Math.round(Math.max(display, progress)));

  return (
    <div
      className="hero3d-loader"
      role="status"
      aria-live="polite"
      aria-label={`تحميل المشهد ${pct}%`}
    >
      <div className="hero3d-loader__mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/shlash_primary_logo_transparent.png"
          alt="شلاش"
          width={120}
          height={132}
        />
      </div>
      <p className="hero3d-loader__brand">شلاش</p>
      <p className="hero3d-loader__sub font-en">Loading yard</p>
      <div className="hero3d-loader__bar" aria-hidden>
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="hero3d-loader__pct font-en">{pct}%</p>
    </div>
  );
}
