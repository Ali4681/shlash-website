"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { PrefsControls } from "@/components/ui/PrefsControls";
import "./admin.css";

type NavIcon =
  | "home"
  | "box"
  | "tag"
  | "brand"
  | "building"
  | "phone"
  | "map"
  | "menu";
const SIDEBAR_KEY = "shlash_cms_sidebar";

function Icon({
  name,
}: {
  name:
    | NavIcon
    | "external"
    | "logout"
    | "burger"
    | "close"
    | "panel"
    | "search"
    | "chevron";
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5v-7Z" />
          <path d="M3 8.5 12 14l9-5.5M12 14v7" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M20 13.5 12.5 21a2 2 0 0 1-2.8 0L3 14.3V4h10.3L20 10.7a2 2 0 0 1 0 2.8Z" />
          <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "brand":
      return (
        <svg {...common}>
          <path d="M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3Z" />
          <path d="M12 12 4.5 7.5M12 12l7.5-4.5M12 12v9" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M4 21h16M6 21V7l6-3 6 3v14M10 10h.01M14 10h.01M10 14h.01M14 14h.01M10 18h.01M14 18h.01" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M8.5 4.8c.4-1 1.5-1.4 2.4-1l2 1c.8.3 1.2 1.2.9 2l-.7 1.8c-.2.4 0 .9.3 1.2l2.6 2.6c.3.3.8.5 1.2.3l1.8-.7c.8-.3 1.7.1 2 .9l1 2c.4.9 0 2-1 2.4-2.2.9-5.9.3-9.5-3.3S7.6 7 8.5 4.8Z" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5 9 4.5Z" />
          <path d="M9 4.5v13M15 6.5v13" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6M20 4 11 13M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M10 17H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4M15 15l4-4-4-4M19 11H9" />
        </svg>
      );
    case "burger":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "panel":
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" />
          <path d="M9.5 4.5v15" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16.5 16.5 21 21" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="M8 10l4 4 4-4" />
        </svg>
      );
  }
}

type ProductHit = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
};

export function AdminShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, dir, locale } = usePrefs();
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [products, setProducts] = useState<ProductHit[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const links = useMemo(
    () => [
      {
        href: "/admin",
        label: dict.admin.overview,
        icon: "home" as const,
        section: dict.admin.dashboard,
      },
      {
        href: "/admin/products",
        label: dict.admin.products,
        icon: "box" as const,
        section: dict.admin.catalog,
      },
      {
        href: "/admin/categories",
        label: dict.admin.categories,
        icon: "tag" as const,
      },
      {
        href: "/admin/brands",
        label: dict.admin.brands,
        icon: "brand" as const,
      },
      {
        href: "/admin/company",
        label: dict.admin.company,
        icon: "building" as const,
        section: dict.admin.siteSection,
      },
      {
        href: "/admin/contact",
        label: dict.admin.contact,
        icon: "phone" as const,
      },
      {
        href: "/admin/coverage",
        label: dict.admin.coverage,
        icon: "map" as const,
      },
      {
        href: "/admin/nav",
        label: dict.admin.nav,
        icon: "menu" as const,
      },
    ],
    [dict],
  );

  const pageHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return links.filter((l) => l.label.toLowerCase().includes(q)).slice(0, 6);
  }, [links, query]);

  const productHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const name = locale === "ar" ? p.nameAr : p.nameEn;
        return (
          name.toLowerCase().includes(q) ||
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);
  }, [products, query, locale]);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "collapsed");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? "collapsed" : "expanded");
    } catch {
      /* ignore */
    }
  }, [collapsed, ready]);

  useEffect(() => {
    setNavOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cms/products");
        if (!res.ok) return;
        const data = (await res.json()) as ProductHit[];
        if (!cancelled && Array.isArray(data)) setProducts(data);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const t = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(t)) {
        setSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(t)) {
        setAccountOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 900px)").matches) {
      setNavOpen((v) => !v);
      return;
    }
    setCollapsed((v) => !v);
  }

  async function logout() {
    await fetch("/api/cms/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function goTo(href: string) {
    setSearchOpen(false);
    setQuery("");
    router.push(href);
  }

  const sidebarToggleLabel = collapsed
    ? dict.admin.expandSidebar
    : dict.admin.collapseSidebar;

  const hasSearchResults = pageHits.length > 0 || productHits.length > 0;
  const showSearchPanel = searchOpen && query.trim().length > 0;

  return (
    <div
      className={cn(
        "admin-shell",
        navOpen && "is-nav-open",
        collapsed && "is-side-collapsed",
      )}
      dir={dir}
    >
      <button
        type="button"
        className="admin-overlay"
        aria-label={dict.header.closeMenu}
        onClick={() => setNavOpen(false)}
      />

      <aside className="admin-side" aria-expanded={!collapsed}>
        <div className="admin-side__brand">
          <div className="admin-side__mark admin-side__mark--logo">
            <Image
              src="/media/character.png"
              alt={dict.brand.cms}
              width={72}
              height={72}
              className="admin-side__logo"
              priority
            />
          </div>
          <div className="admin-side__brand-text">
            <strong>{dict.brand.cms}</strong>
            <span>{dict.brand.cmsSub}</span>
          </div>
          <button
            type="button"
            className="admin-side__collapse"
            aria-label={sidebarToggleLabel}
            title={sidebarToggleLabel}
            onClick={toggleSidebar}
          >
            <Icon name="panel" />
          </button>
        </div>

        <nav className="admin-side__nav" aria-label={dict.admin.dashboard}>
          {links.map((link, i) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            const prev = links[i - 1];
            const showSection = link.section && link.section !== prev?.section;
            return (
              <div key={link.href}>
                {showSection ? (
                  <div className="admin-side__section">{link.section}</div>
                ) : null}
                <Link
                  href={link.href}
                  className={cn("admin-side__link", active && "is-active")}
                  title={link.label}
                >
                  <Icon name={link.icon} />
                  <span className="admin-side__link-label">{link.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-navbar">
          <div className="admin-navbar__start">
            <button
              type="button"
              className="admin-menu-btn admin-menu-btn--mobile"
              aria-label={navOpen ? dict.header.closeMenu : dict.header.openMenu}
              onClick={() => setNavOpen((v) => !v)}
            >
              <Icon name={navOpen ? "close" : "burger"} />
            </button>
            <button
              type="button"
              className="admin-menu-btn admin-menu-btn--desktop"
              aria-label={sidebarToggleLabel}
              title={sidebarToggleLabel}
              onClick={toggleSidebar}
            >
              <Icon name="panel" />
            </button>

            <div className="admin-search" ref={searchRef}>
              <label className="admin-search__field">
                <Icon name="search" />
                <input
                  type="search"
                  value={query}
                  placeholder={dict.admin.searchPlaceholder}
                  aria-label={dict.admin.searchPlaceholder}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (pageHits[0]) goTo(pageHits[0].href);
                      else if (productHits[0])
                        goTo(`/admin/products/${productHits[0].id}`);
                    }
                  }}
                />
              </label>

              {showSearchPanel ? (
                <div className="admin-search__panel" role="listbox">
                  {!hasSearchResults ? (
                    <p className="admin-search__empty">{dict.admin.searchEmpty}</p>
                  ) : (
                    <>
                      {pageHits.length > 0 ? (
                        <div className="admin-search__group">
                          <p className="admin-search__group-label">
                            {dict.admin.searchPages}
                          </p>
                          {pageHits.map((hit) => (
                            <button
                              key={hit.href}
                              type="button"
                              className="admin-search__hit"
                              role="option"
                              onClick={() => goTo(hit.href)}
                            >
                              <Icon name={hit.icon} />
                              <span>{hit.label}</span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {productHits.length > 0 ? (
                        <div className="admin-search__group">
                          <p className="admin-search__group-label">
                            {dict.admin.searchProducts}
                          </p>
                          {productHits.map((hit) => (
                            <button
                              key={hit.id}
                              type="button"
                              className="admin-search__hit"
                              role="option"
                              onClick={() => goTo(`/admin/products/${hit.id}`)}
                            >
                              <Icon name="box" />
                              <span>
                                {locale === "ar" ? hit.nameAr : hit.nameEn}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="admin-navbar__end">
            <PrefsControls tone="admin" />

            <div className="admin-account" ref={accountRef}>
              <button
                type="button"
                className={cn(
                  "admin-account__trigger",
                  accountOpen && "is-open",
                )}
                aria-expanded={accountOpen}
                aria-label={dict.admin.accountMenu}
                onClick={() => setAccountOpen((v) => !v)}
              >
                <span className="admin-account__avatar">AD</span>
                <span className="admin-account__meta">
                  <strong>{dict.admin.adminUser}</strong>
                  <span>{dict.admin.session}</span>
                </span>
                <Icon name="chevron" />
              </button>

              {accountOpen ? (
                <div className="admin-account__menu" role="menu">
                  <a
                    className="admin-account__item"
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    role="menuitem"
                  >
                    <Icon name="external" />
                    <span>{dict.admin.openSite}</span>
                  </a>
                  <button
                    type="button"
                    className="admin-account__item admin-account__item--danger"
                    role="menuitem"
                    onClick={logout}
                  >
                    <Icon name="logout" />
                    <span>{dict.admin.logout}</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="admin-header">
          <div className="admin-header__start">
            <div>
              <p className="admin-header__eyebrow">{dict.brand.control}</p>
              <h1>{title}</h1>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          </div>
          {actions ? (
            <div className="admin-header__end">{actions}</div>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
