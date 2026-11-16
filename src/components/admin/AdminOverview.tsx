"use client";

import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { usePrefs } from "@/components/providers/PrefsProvider";

function StatIcon({ kind }: { kind: "products" | "categories" | "brands" | "coverage" }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "products") {
    return (
      <svg {...common}>
        <path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5v-7Z" />
        <path d="M3 8.5 12 14l9-5.5M12 14v7" />
      </svg>
    );
  }
  if (kind === "categories") {
    return (
      <svg {...common}>
        <path d="M20 13.5 12.5 21a2 2 0 0 1-2.8 0L3 14.3V4h10.3L20 10.7a2 2 0 0 1 0 2.8Z" />
      </svg>
    );
  }
  if (kind === "brands") {
    return (
      <svg {...common}>
        <path d="M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5 9 4.5Z" />
    </svg>
  );
}

export function AdminOverview({
  products,
  categories,
  brands,
  coverage,
}: {
  products: number;
  categories: number;
  brands: number;
  coverage: number;
}) {
  const { dict } = usePrefs();

  return (
    <AdminShell title={dict.admin.overview} subtitle={dict.admin.overviewSub}>
      <div className="admin-grid admin-grid--stats">
        <div className="admin-card admin-stat" data-tone="orange">
          <div className="admin-stat__icon">
            <StatIcon kind="products" />
          </div>
          <div className="admin-stat__meta">
            <div>
              <strong>{products}</strong>
              <span>{dict.admin.products}</span>
            </div>
          </div>
        </div>
        <div className="admin-card admin-stat" data-tone="ice">
          <div className="admin-stat__icon">
            <StatIcon kind="categories" />
          </div>
          <div className="admin-stat__meta">
            <div>
              <strong>{categories}</strong>
              <span>{dict.admin.categories}</span>
            </div>
          </div>
        </div>
        <div className="admin-card admin-stat">
          <div className="admin-stat__icon">
            <StatIcon kind="brands" />
          </div>
          <div className="admin-stat__meta">
            <div>
              <strong>{brands}</strong>
              <span>{dict.admin.brands}</span>
            </div>
          </div>
        </div>
        <div className="admin-card admin-stat" data-tone="navy">
          <div className="admin-stat__icon">
            <StatIcon kind="coverage" />
          </div>
          <div className="admin-stat__meta">
            <div>
              <strong>{coverage}</strong>
              <span>{dict.admin.coverage}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <div className="admin-panel-head">
          <div>
            <h2>{dict.admin.shortcuts}</h2>
            <p>{dict.admin.shortcutsSub}</p>
          </div>
        </div>
        <div className="admin-shortcuts">
          <Link className="admin-shortcut" href="/admin/products/new">
            <span className="admin-shortcut__icon">
              <StatIcon kind="products" />
            </span>
            <strong>{dict.admin.addProduct}</strong>
            <span>{dict.admin.addProductHint}</span>
          </Link>
          <Link className="admin-shortcut" href="/admin/company">
            <span className="admin-shortcut__icon">
              <StatIcon kind="brands" />
            </span>
            <strong>{dict.admin.company}</strong>
            <span>{dict.admin.companyHint}</span>
          </Link>
          <Link className="admin-shortcut" href="/admin/contact">
            <span className="admin-shortcut__icon">
              <StatIcon kind="coverage" />
            </span>
            <strong>{dict.admin.contact}</strong>
            <span>{dict.admin.contactHint}</span>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
