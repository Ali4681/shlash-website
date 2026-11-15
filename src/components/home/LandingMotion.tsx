"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LandingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* Product cards own their entrance via IntersectionObserver + --i stagger */

      gsap.from(".coverage-card", {
        y: 24,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#coverage",
          start: "top 75%",
          once: true,
        },
      });

      /* Coverage pins animate via CSS on the GeoJSON map */

      gsap.from(".fact-item", {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#who",
          start: "top 75%",
          once: true,
        },
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 350);
    window.addEventListener("load", refresh);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return null;
}
