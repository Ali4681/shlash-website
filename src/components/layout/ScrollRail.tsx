"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { scrollPageTo } from "@/lib/lenis-control";
import "./scroll-rail.css";

const PAD = 12;

/** Branded page scrollbar — replaces the native Windows chrome rail. */
export function ScrollRail() {
  const { dict } = usePrefs();
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const scrollTimer = useRef<number | null>(null);
  const dragRef = useRef<{
    active: boolean;
    pointerId: number;
    grabOffset: number;
    thumbH: number;
    travel: number;
  } | null>(null);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 819px), (pointer: coarse)").matches;
    if (mobile) return;
    setEnabled(true);
    document.documentElement.classList.add("has-scroll-rail");
    return () => document.documentElement.classList.remove("has-scroll-rail");
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const metrics = () => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const track = window.innerHeight - PAD * 2;
      const thumbH = Math.max((window.innerHeight / doc.scrollHeight) * track, 48);
      const travel = Math.max(track - thumbH, 0);
      const ratio = Math.min(Math.max(window.scrollY / max, 0), 1);
      return { max, track, thumbH, travel, ratio };
    };

    const sync = () => {
      if (dragRef.current?.active) return;
      const { thumbH, travel, ratio } = metrics();
      const thumb = thumbRef.current;
      if (!thumb) return;
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translate3d(0, ${ratio * travel}px, 0)`;
    };

    const scrollFromThumbY = (thumbTop: number, immediate: boolean) => {
      const { max, travel, thumbH } = metrics();
      const clamped = Math.min(Math.max(thumbTop, 0), travel);
      const ratio = travel > 0 ? clamped / travel : 0;
      const thumb = thumbRef.current;
      if (thumb) {
        thumb.style.height = `${thumbH}px`;
        thumb.style.transform = `translate3d(0, ${clamped}px, 0)`;
      }
      scrollPageTo(ratio * max, immediate);
    };

    const onScroll = () => {
      sync();
      document.documentElement.classList.add("is-scrolling");
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
      scrollTimer.current = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 700);
    };

    const onPointerDownRail = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const rail = railRef.current;
      const thumb = thumbRef.current;
      if (!rail || !thumb) return;

      const { thumbH, travel } = metrics();
      const railRect = rail.getBoundingClientRect();
      const yInTrack = e.clientY - railRect.top - PAD;
      const thumbRect = thumb.getBoundingClientRect();
      const onThumb =
        e.clientY >= thumbRect.top && e.clientY <= thumbRect.bottom;

      let thumbTop: number;
      let grabOffset: number;
      if (onThumb) {
        thumbTop = thumbRect.top - railRect.top - PAD;
        grabOffset = e.clientY - thumbRect.top;
      } else {
        thumbTop = yInTrack - thumbH / 2;
        grabOffset = thumbH / 2;
        scrollFromThumbY(thumbTop, true);
      }

      dragRef.current = {
        active: true,
        pointerId: e.pointerId,
        grabOffset,
        thumbH,
        travel,
      };
      rail.setPointerCapture(e.pointerId);
      document.documentElement.classList.add("is-scrolling", "is-rail-dragging");
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag?.active || drag.pointerId !== e.pointerId) return;
      const rail = railRef.current;
      if (!rail) return;
      const railRect = rail.getBoundingClientRect();
      const thumbTop = e.clientY - railRect.top - PAD - drag.grabOffset;
      scrollFromThumbY(thumbTop, true);
      e.preventDefault();
    };

    const endDrag = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag?.active || drag.pointerId !== e.pointerId) return;
      dragRef.current = null;
      document.documentElement.classList.remove("is-rail-dragging");
      try {
        railRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const rail = railRef.current;
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);
    rail?.addEventListener("pointerdown", onPointerDownRail);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    const ro = new ResizeObserver(sync);
    ro.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
      rail?.removeEventListener("pointerdown", onPointerDownRail);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      ro.disconnect();
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
      document.documentElement.classList.remove("is-scrolling", "is-rail-dragging");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={railRef}
      className="scroll-rail"
      role="scrollbar"
      aria-orientation="vertical"
      aria-controls="top"
      tabIndex={0}
      aria-label={dict.a11y.scrollRail}
    >
      <span ref={thumbRef} className="scroll-rail__thumb" />
    </div>
  );
}
