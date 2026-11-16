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
import type { ContactChannel, SocialLink } from "@/data/contact";
import { cn } from "@/lib/cn";
import { pickLocalized } from "@/lib/i18n/dictionaries";
import { lockPageScroll, unlockPageScroll } from "@/lib/lenis-control";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { PrefsControls } from "@/components/ui/PrefsControls";
import "./header.css";

type NavItem = { href: string; label: string };
type SiteInfo = {
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  taglineAr: string;
  taglineEn: string;
  phone: string;
  email: string;
  address: string;
};
type ContactInfo = {
  hoursAr: string;
  hoursEn: string;
  addressAr: string;
  addressEn?: string;
  channels: ContactChannel[];
  social: SocialLink[];
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Header({
  site,
  nav,
  contact,
}: {
  site: SiteInfo;
  nav: NavItem[];
  contact: ContactInfo;
}) {
  const { locale, dict } = usePrefs();
  const brandName = pickLocalized(locale, site.nameAr, site.nameEn);
  const brandRole = pickLocalized(locale, site.roleAr, site.roleEn);
  const hours = pickLocalized(locale, contact.hoursAr, contact.hoursEn);
  const localizedNav = nav.map((item) => ({
    ...item,
    label: dict.nav[item.href] ?? item.label,
  }));
  const sectionIds = localizedNav.map((item) => item.href.replace("#", ""));
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeHref, setActiveHref] = useState(localizedNav[0]?.href ?? "#top");
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const lastScrollY = useRef(0);
  const drawerTween = useRef<gsap.core.Timeline | null>(null);

  const whatsapp = contact.channels.find(
    (c) => c.type === "whatsapp" && c.enabled,
  );
  const phone = contact.channels.find(
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

      let current = localizedNav[0]?.href ?? "#top";
      for (const id of sectionIds) {
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
    const overlay = overlayRef.current;
    const list = drawerListRef.current;
    if (!drawer || !list) return;

    drawerTween.current?.kill();

    const links = list.querySelectorAll<HTMLElement>(".site-header__drawer-link");
    const labels = list.querySelectorAll<HTMLElement>(".site-header__drawer-label");
    const indexes = list.querySelectorAll<HTMLElement>(".site-header__drawer-index");
    const meta = drawer.querySelector<HTMLElement>(".site-header__drawer-meta");
    const cta = drawer.querySelector<HTMLElement>(".site-header__drawer-cta");
    const chips = drawer.querySelectorAll<HTMLElement>(".site-header__drawer-chip");
    const glow = drawer.querySelector<HTMLElement>(".site-header__drawer-glow");

    if (prefersReducedMotion()) {
      gsap.set(drawer, {
        autoAlpha: menuOpen ? 1 : 0,
        clearProps: menuOpen ? "transform,filter,clipPath" : "",
        pointerEvents: menuOpen ? "auto" : "none",
      });
      if (overlay) {
        gsap.set(overlay, {
          autoAlpha: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        });
      }
      gsap.set([links, meta, cta, chips], {
        clearProps: "all",
        autoAlpha: 1,
        y: 0,
        x: 0,
      });
      return;
    }

    if (menuOpen) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      drawerTween.current = tl;

      gsap.set(links, { autoAlpha: 0, y: 28, rotateX: -18 });
      gsap.set(labels, { x: 18, filter: "blur(6px)" });
      gsap.set(indexes, { autoAlpha: 0, y: 10 });
      gsap.set([chips, cta, meta], { autoAlpha: 0, y: 20, scale: 0.96 });
      if (glow) gsap.set(glow, { scale: 0.6, autoAlpha: 0 });

      if (overlay) {
        tl.fromTo(
          overlay,
          { autoAlpha: 0, pointerEvents: "none" },
          { autoAlpha: 1, pointerEvents: "auto", duration: 0.38, ease: "power2.out" },
          0,
        );
      }

      tl.fromTo(
        drawer,
        {
          autoAlpha: 0,
          y: -28,
          scale: 0.92,
          filter: "blur(10px)",
          clipPath: "inset(0 0 100% 0 round 1.5rem)",
          pointerEvents: "none",
          transformOrigin: "50% 0%",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0 0 0% 0 round 1.5rem)",
          pointerEvents: "auto",
          duration: 0.55,
          ease: "power4.out",
        },
        0.04,
      );

      if (glow) {
        tl.to(
          glow,
          { scale: 1, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
          0.12,
        );
      }

      tl.to(
        links,
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.48,
          stagger: 0.055,
          ease: "power3.out",
        },
        0.18,
      )
        .to(
          labels,
          {
            x: 0,
            filter: "blur(0px)",
            duration: 0.42,
            stagger: 0.055,
            ease: "power3.out",
          },
          0.2,
        )
        .to(
          indexes,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.36,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.28,
        )
        .to(
          chips,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: "back.out(1.4)",
          },
          0.38,
        )
        .to(
          cta,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.6)",
          },
          0.44,
        )
        .to(
          meta,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
          0.5,
        );
    } else {
      const tl = gsap.timeline({ defaults: { ease: "power2.in" } });
      drawerTween.current = tl;

      tl.to(
        [links, chips, cta, meta],
        {
          autoAlpha: 0,
          y: -8,
          duration: 0.18,
          stagger: 0.015,
        },
        0,
      )
        .to(
          drawer,
          {
            autoAlpha: 0,
            y: -16,
            scale: 0.96,
            filter: "blur(6px)",
            clipPath: "inset(0 0 40% 0 round 1.5rem)",
            pointerEvents: "none",
            duration: 0.32,
          },
          0.05,
        );

      if (overlay) {
        tl.to(
          overlay,
          { autoAlpha: 0, pointerEvents: "none", duration: 0.3 },
          0.08,
        );
      }
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
        <div ref={shellRef} className="site-header__shell">
          <span className="site-header__sheen" aria-hidden />

          <a href="#top" className="site-header__brand" aria-label={brandName}>
            <span className="site-header__logo-wrap">
              <Image
                src="/media/character.png"
                alt={brandName}
                width={96}
                height={96}
                className="site-header__logo"
                priority
              />
            </span>
            <span className="site-header__brand-text">
              <strong className="site-header__brand-name">{brandName}</strong>
              <span className="site-header__brand-role" dir={locale === "en" ? "ltr" : undefined}>
                {brandRole}
              </span>
            </span>
          </a>

          <nav
            ref={navRef}
            className="site-header__nav"
            aria-label={dict.header.mainNav}
            onPointerMove={onNavPointerMove}
            onPointerLeave={onNavPointerLeave}
          >
            <span ref={spotlightRef} className="site-header__spotlight" aria-hidden />
            <span
              ref={indicatorRef}
              className={cn("site-header__indicator", indicatorReady && "is-ready")}
              aria-hidden
            />
            {localizedNav.map((item) => (
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
            <PrefsControls tone="site" className="site-header__prefs" />
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
                <span className="site-header__cta-label">{dict.header.whatsapp}</span>
                <span className="site-header__cta-glow" aria-hidden />
              </a>
            )}
            <button
              type="button"
              className="site-header__toggle"
              aria-label={menuOpen ? dict.header.closeMenu : dict.header.openMenu}
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
        ref={overlayRef}
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
        aria-label={dict.header.mainNav}
      >
        <div className="site-header__drawer-glow" aria-hidden />
        <ul ref={drawerListRef} className="site-header__drawer-list">
          {localizedNav.map((item, i) => (
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
            {hours}
          </span>
        </div>

        <div className="site-header__drawer-prefs">
          <PrefsControls tone="site" />
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
            {dict.header.whatsapp}
          </a>
        )}

        <p className="site-header__drawer-meta">
          {hours}
          <br />
          {pickLocalized(locale, contact.addressAr, contact.addressEn)}
        </p>
      </div>
    </div>
  );
}
