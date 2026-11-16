"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { marhey } from "@/lib/fonts";
import { cn } from "@/lib/cn";
import { pickLocalized } from "@/lib/i18n/dictionaries";
import { usePrefs } from "@/components/providers/PrefsProvider";
import "./scroll-hero.css";

type SiteInfo = {
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
};

export function ScrollHero({ site }: { site: SiteInfo }) {
  const { locale, dict } = usePrefs();
  const brandName = pickLocalized(locale, site.nameAr, site.nameEn);
  const brandRole = pickLocalized(locale, site.roleAr, site.roleEn);
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const brand = brandRef.current;
    const aside = asideRef.current;
    if (!root || !frame || !brand || !aside) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([brand, aside, frame], { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.set(frame, { scale: 1.08 });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(frame, { scale: 1.02, duration: 1.6 }, 0)
        .fromTo(brand, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.95 }, 0.12)
        .fromTo(aside, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 }, 0.28);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="story" className="scroll-hero" aria-label={dict.hero.aria}>
      <div className="scroll-hero__sticky">
        <div ref={frameRef} className="scroll-hero__frame absolute inset-0">
          <Image
            src="/media/hero-still-hq.jpg"
            alt={dict.hero.alt}
            fill
            priority
            quality={100}
            unoptimized
            sizes="100vw"
            className="scroll-hero__image object-cover"
          />
        </div>

        <div className="scroll-hero__veil" aria-hidden />
        <div className="scroll-hero__glow" aria-hidden />

        <div ref={asideRef} className="scroll-hero__aside">
          <p
            className="scroll-hero__aside-label"
            dir={locale === "en" ? "ltr" : undefined}
          >
            {brandRole}
          </p>
          <p className="scroll-hero__aside-line">{dict.hero.line}</p>
          <span className="scroll-hero__aside-rule" aria-hidden />
          <div className="scroll-hero__actions">
            <a href="#products" className="scroll-hero__btn scroll-hero__btn--primary">
              {dict.hero.discover}
            </a>
            <a href="#contact" className="scroll-hero__btn scroll-hero__btn--ghost">
              {dict.hero.contact}
            </a>
          </div>
        </div>

        <div ref={brandRef} className="scroll-hero__brand">
          <p className="scroll-hero__kicker">{brandRole}</p>
          <h1 className={cn(marhey.className, "scroll-hero__wordmark")}>
            <span className="scroll-hero__wordmark-stroke" aria-hidden>
              {brandName}
            </span>
            <span className="scroll-hero__wordmark-fill">{brandName}</span>
          </h1>
          {locale === "ar" ? (
            <p className="scroll-hero__en" dir="ltr">
              {site.nameEn}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
