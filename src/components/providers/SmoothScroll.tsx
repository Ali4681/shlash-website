"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerLenis } from "@/lib/lenis-control";

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = -88;

function resolveHashTarget(hash: string): HTMLElement | null {
  if (!hash || hash === "#") return null;
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return null;
  if (id === "top") {
    return (document.getElementById("top") as HTMLElement | null) ?? document.body;
  }
  return document.getElementById(id);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Touch devices need native momentum — Lenis syncTouch feels heavy/laggy. */
    const preferNativeTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches ||
      (navigator.maxTouchPoints > 0 && window.matchMedia("(max-width: 1024px)").matches);

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: reduceMotion ? 0.01 : preferNativeTouch ? 1.05 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduceMotion && !preferNativeTouch,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      /* Keep finger scroll native on phones/tablets */
      syncTouch: false,
      syncTouchLerp: 0.1,
      touchInertiaExponent: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);
    registerLenis(lenis);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    /* Allow GSAP to drop catch-up work on janky mobile frames */
    gsap.ticker.lagSmoothing(preferNativeTouch ? 500 : 0);
    document.documentElement.classList.add("lenis");
    if (preferNativeTouch) {
      document.documentElement.classList.add("lenis-native-touch");
    }

    // Always land on the hero/header after refresh — ignore leftover hashes
    lenis.scrollTo(0, { immediate: true });
    if (window.location.hash && window.location.hash !== "#top") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const scrollToHash = (hash: string, push = true) => {
      const target = resolveHashTarget(hash);
      if (!target) return false;

      lenis.scrollTo(target, {
        offset: hash === "#top" ? 0 : HEADER_OFFSET,
        duration: reduceMotion ? 0 : 1.35,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        onComplete: () => ScrollTrigger.refresh(),
      });

      if (push) {
        const next = hash === "#top" ? window.location.pathname + window.location.search : hash;
        if (hash === "#top") {
          history.pushState(null, "", next);
        } else if (window.location.hash !== hash) {
          history.pushState(null, "", hash);
        }
      }
      return true;
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href^='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      // External-looking hashes on other paths — keep default
      const link = anchor as HTMLAnchorElement;
      if (link.origin && link.origin !== window.location.origin) return;
      if (link.pathname && link.pathname !== window.location.pathname) return;

      if (!resolveHashTarget(href)) return;

      event.preventDefault();
      scrollToHash(href, true);
    };

    const onPopState = () => {
      if (window.location.hash) {
        scrollToHash(window.location.hash, false);
      } else {
        lenis.scrollTo(0, {
          duration: reduceMotion ? 0 : 1.05,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      }
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      gsap.ticker.remove(ticker);
      registerLenis(null);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-native-touch");
    };
  }, []);

  return children;
}
