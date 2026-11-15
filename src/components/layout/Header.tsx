"use client";

import Image from "next/image";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { nav, site } from "@/data/site";
import { contactSettings } from "@/data/contact";
import { cn } from "@/lib/cn";
import { lockPageScroll, unlockPageScroll } from "@/lib/lenis-control";
import "./header.css";

const SECTION_IDS = nav.map((item) => item.href.replace("#", ""));

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeHref, setActiveHref] = useState(nav[0]?.href ?? "#top");
  const [indicatorReady, setIndicatorReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const spotlightRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerListRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const lastScrollY = useRef(0);
  const drawerTween = useRef<gsap.core.Timeline | null>(null);

  const whatsapp = contactSettings.channels.find(
    (c) => c.type === "whatsapp" && c.enabled,
  );
  const phone = contactSettings.channels.find(
    (c) => c.type === "phone" && c.enabled,
  );

  const moveIndicator = useCallback((href: string, instant = false) => {
    const navEl = navRef.current;
    const link = linkRefs.current[href];
    const indicator = indicatorRef.current;
    if (!navEl || !link || !indicator) return;

    const navBox = navEl.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    const insetStart = navBox.right - linkBox.right;
    const width = linkBox.width;

    if (instant || prefersReducedMotion()) {
      gsap.set(indicator, { width, x: -insetStart, opacity: 1 });
    } else {
      gsap.to(indicator, {
        width,
        x: -insetStart,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
    setIndicatorReady(true);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
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
      const y = window.scrollY;
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      setProgress(Math.min(y / max, 1));

      const hero = document.getElementById("story");
      const threshold = hero
        ? Math.max(hero.offsetHeight - window.innerHeight * 0.92, 120)
        : 160;
      const nextSolid = y > threshold;
      setSolid(nextSolid);

      const delta = y - lastScrollY.current;
      if (!menuOpen) {
        if (y < 80) {
          setHidden(false);
        } else if (delta > 8 && nextSolid) {
          setHidden(true);
        } else if (delta < -6) {
          setHidden(false);
        }
      }
      lastScrollY.current = y;

      let current = nav[0]?.href ?? "#top";
      for (const id of SECTION_IDS) {
        if (id === "top") continue;
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = `#${id}`;
        }
      }
      if (y < window.innerHeight * 0.45) current = "#top";
      setActiveHref((prev) => (prev === current ? prev : current));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    moveIndicator(activeHref);
  }, [activeHref, moveIndicator]);

  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY;
    lockPageScroll();
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    const onTouchMove = (e: TouchEvent) => {
      const target = e.target as Element | null;
      const inDrawer = target?.closest?.(".site-header__drawer");
      if (!inDrawer) {
        e.preventDefault();
        return;
      }
      /* Block overscroll chaining from drawer to page */
      const drawer = drawerRef.current;
      if (!drawer) return;
      const { scrollTop, scrollHeight, clientHeight } = drawer;
      const touch = e.touches[0];
      const lastY = Number(drawer.dataset.touchY ?? touch.clientY);
      const delta = touch.clientY - lastY;
      drawer.dataset.touchY = String(touch.clientY);
      const atTop = scrollTop <= 0 && delta > 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && delta < 0;
      if (atTop || atBottom) e.preventDefault();
    };

    const onTouchStart = (e: TouchEvent) => {
      const drawer = drawerRef.current;
      if (!drawer || !e.touches[0]) return;
      drawer.dataset.touchY = String(e.touches[0].clientY);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      unlockPageScroll();
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Drawer open / close choreography */
  useEffect(() => {
    const drawer = drawerRef.current;
    const list = drawerListRef.current;
    if (!drawer || !list) return;

    drawerTween.current?.kill();

    const links = list.querySelectorAll(".site-header__drawer-link");
    const meta = drawer.querySelector(".site-header__drawer-meta");
    const cta = drawer.querySelector(".site-header__drawer-cta");
    const chips = drawer.querySelectorAll(".site-header__drawer-chip");

    if (prefersReducedMotion()) {
      gsap.set(drawer, {
        autoAlpha: menuOpen ? 1 : 0,
        y: 0,
        scale: 1,
        pointerEvents: menuOpen ? "auto" : "none",
      });
      gsap.set([links, meta, cta, chips], { clearProps: "all", autoAlpha: 1, y: 0 });
      return;
    }

    if (menuOpen) {
      const tl = gsap.timeline();
      drawerTween.current = tl;
      gsap.set([links, meta, cta, chips], { autoAlpha: 0, y: 14 });
      tl.fromTo(
        drawer,
        { autoAlpha: 0, y: -18, scale: 0.97, pointerEvents: "none" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          pointerEvents: "auto",
          duration: 0.42,
          ease: "power3.out",
        },
      )
        .to(
          links,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.045,
            ease: "power3.out",
          },
          "-=0.18",
        )
        .to(
          [chips, cta, meta],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.36,
            stagger: 0.05,
            ease: "power3.out",
          },
          "-=0.22",
        );
    } else {
      gsap.to(drawer, {
        autoAlpha: 0,
        y: -12,
        scale: 0.98,
        pointerEvents: "none",
        duration: 0.28,
        ease: "power2.in",
      });
    }
  }, [menuOpen]);

  /* Entrance */
  useEffect(() => {
    if (!mounted || !shellRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      shellRef.current,
      { y: -28, autoAlpha: 0, filter: "blur(8px)" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
        delay: 0.15,
      },
    );
  }, [mounted]);

  const onNavPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const navEl = navRef.current;
    const spot = spotlightRef.current;
    if (!navEl || !spot) return;
    const box = navEl.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    spot.style.setProperty("--spot-x", `${x}px`);
    spot.style.setProperty("--spot-y", `${y}px`);
    spot.classList.add("is-on");
  };

  const onNavPointerLeave = () => {
    spotlightRef.current?.classList.remove("is-on");
  };

  const onCtaMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return;
    const el = ctaRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const mx = e.clientX - (box.left + box.width / 2);
    const my = e.clientY - (box.top + box.height / 2);
    gsap.to(el, {
      x: mx * 0.22,
      y: my * 0.28,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onCtaLeave = () => {
    if (!ctaRef.current) return;
    gsap.to(ctaRef.current, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "site-header-root",
        solid && "is-solid",
        menuOpen && "is-open",
        hidden && !menuOpen && "is-hidden",
        mounted && "is-mounted",
      )}
    >
      <header className="site-header" role="banner">
        <div
          ref={shellRef}
          className="site-header__shell"
          style={{ ["--scroll-progress" as string]: String(progress) }}
        >
          <span className="site-header__progress" aria-hidden>
            <span
              className="site-header__progress-fill"
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
          <span className="site-header__sheen" aria-hidden />

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

          <nav
            ref={navRef}
            className="site-header__nav"
            aria-label="التنقل الرئيسي"
            onPointerMove={onNavPointerMove}
            onPointerLeave={onNavPointerLeave}
          >
            <span ref={spotlightRef} className="site-header__spotlight" aria-hidden />
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
                className={cn(
                  "site-header__link",
                  activeHref === item.href && "is-active",
                )}
                onMouseEnter={() => moveIndicator(item.href)}
                onFocus={() => moveIndicator(item.href)}
                onMouseLeave={() => moveIndicator(activeHref)}
                onBlur={() => moveIndicator(activeHref)}
              >
                <span className="site-header__link-label">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            {whatsapp && (
              <a
                ref={ctaRef}
                href={whatsapp.href}
                className="site-header__cta"
                target="_blank"
                rel="noreferrer"
                onPointerMove={onCtaMove}
                onPointerLeave={onCtaLeave}
              >
                <span className="site-header__cta-dot" aria-hidden />
                <span className="site-header__cta-label">WhatsApp</span>
                <span className="site-header__cta-glow" aria-hidden />
              </a>
            )}
            <button
              type="button"
              className="site-header__toggle"
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={menuOpen}
              aria-controls="site-header-drawer"
              onClick={() => {
                setMenuOpen((v) => !v);
                setHidden(false);
              }}
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

      <div
        id="site-header-drawer"
        ref={drawerRef}
        className="site-header__drawer"
        role="dialog"
        aria-modal={menuOpen}
        aria-hidden={!menuOpen}
        aria-label="قائمة التنقل"
      >
        <div className="site-header__drawer-glow" aria-hidden />
        <ul ref={drawerListRef} className="site-header__drawer-list">
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

        <div className="site-header__drawer-chips">
          {phone && (
            <a href={phone.href} className="site-header__drawer-chip" dir="ltr">
              {phone.value}
            </a>
          )}
          <span className="site-header__drawer-chip site-header__drawer-chip--muted">
            {contactSettings.hoursEn}
          </span>
        </div>

        {whatsapp && (
          <a
            href={whatsapp.href}
            className="site-header__drawer-cta"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            <span className="site-header__cta-dot" aria-hidden />
            تواصل عبر واتساب
          </a>
        )}

        <p className="site-header__drawer-meta">
          {contactSettings.hoursAr}
          <br />
          {contactSettings.addressAr}
        </p>
      </div>
    </div>
  );
}
