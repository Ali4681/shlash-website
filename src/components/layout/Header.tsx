"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { nav, site } from "@/data/site";
import { contactSettings } from "@/data/contact";
import { cn } from "@/lib/cn";
import "./header.css";

const SECTION_IDS = nav.map((item) => item.href.replace("#", ""));

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(nav[0]?.href ?? "#top");
  const [indicatorReady, setIndicatorReady] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const whatsapp = contactSettings.channels.find((c) => c.type === "whatsapp" && c.enabled);

  const moveIndicator = useCallback((href: string, instant = false) => {
    const navEl = navRef.current;
    const link = linkRefs.current[href];
    const indicator = indicatorRef.current;
    if (!navEl || !link || !indicator) return;

    const navBox = navEl.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    // RTL: measure from the inline-start (right) edge
    const insetStart = navBox.right - linkBox.right;
    const width = linkBox.width;

    if (instant) indicator.style.transition = "none";
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${-insetStart}px)`;
    if (instant) {
      // force reflow then restore transition
      void indicator.offsetWidth;
      indicator.style.transition = "";
    }
    setIndicatorReady(true);
  }, []);

  useLayoutEffect(() => {
    moveIndicator(activeHref, true);
  }, [activeHref, solid, moveIndicator]);

  useEffect(() => {
    const onResize = () => moveIndicator(activeHref, true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeHref, moveIndicator]);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("story");
      const threshold = hero ? Math.max(hero.offsetHeight - window.innerHeight * 0.92, 120) : 160;
      setSolid(window.scrollY > threshold);

      // Active section spy
      let current = nav[0]?.href ?? "#top";
      for (const id of SECTION_IDS) {
        if (id === "top") continue;
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.35) {
          current = `#${id}`;
        }
      }
      // Still in hero / header zone
      if (window.scrollY < window.innerHeight * 0.45) {
        current = "#top";
      }
      setActiveHref((prev) => (prev === current ? prev : current));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    moveIndicator(activeHref);
  }, [activeHref, moveIndicator]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "site-header",
          solid && "site-header--solid site-header--docked",
          menuOpen && "site-header--open site-header--solid",
        )}
      >
        <div className="site-header__shell">
          <a href="#top" className="site-header__brand" aria-label={site.nameAr}>
            <span className="site-header__logo-wrap">
              <Image
                src="/media/character.png"
                alt={site.nameAr}
                width={96}
                height={96}
                className="site-header__logo"
                priority
              />
            </span>
            <span className="site-header__brand-text">
              <strong className="site-header__brand-name">{site.nameAr}</strong>
              <span className="site-header__brand-role">{site.roleEn}</span>
            </span>
          </a>

          <nav ref={navRef} className="site-header__nav" aria-label="التنقل الرئيسي">
            <span
              ref={indicatorRef}
              className={cn("site-header__indicator", indicatorReady && "is-ready")}
              aria-hidden
            />
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                ref={(el) => {
                  linkRefs.current[item.href] = el;
                }}
                className={cn("site-header__link", activeHref === item.href && "is-active")}
                onMouseEnter={() => moveIndicator(item.href)}
                onFocus={() => moveIndicator(item.href)}
                onMouseLeave={() => moveIndicator(activeHref)}
                onBlur={() => moveIndicator(activeHref)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            {whatsapp && (
              <a
                href={whatsapp.href}
                className="site-header__cta"
                target="_blank"
                rel="noreferrer"
              >
                <span className="site-header__cta-dot" aria-hidden />
                WhatsApp
              </a>
            )}
            <button
              type="button"
              className="site-header__toggle"
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="site-header__burger" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

        </div>
      </header>

      <div
        className="site-header__overlay"
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <div className="site-header__drawer" role="dialog" aria-modal={menuOpen} aria-hidden={!menuOpen}>
        <ul className="site-header__drawer-list">
          {nav.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "site-header__drawer-link",
                  activeHref === item.href && "is-active",
                )}
                onClick={() => setMenuOpen(false)}
              >
                <span className="site-header__drawer-label">{item.label}</span>
                <span className="site-header__drawer-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="site-header__drawer-meta">
          {contactSettings.hoursAr}
          <br />
          {contactSettings.addressAr}
        </p>
      </div>
    </>
  );
}
