"use client";

import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { pickLocalized } from "@/lib/i18n/dictionaries";

type ProductRow = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  available: boolean;
  category: { nameAr: string; nameEn: string };
  units: { amount: number; currency: string }[];
};

export function AdminProductsClient({ products }: { products: ProductRow[] }) {
  const { locale, dict } = usePrefs();

  return (
    <AdminShell
      title={dict.admin.products}
      subtitle={dict.admin.productsSub}
      actions={
        <Link className="admin-btn admin-btn--primary" href="/admin/products/new">
          {dict.admin.newProduct}
        </Link>
      }
    >
      <div className="admin-card admin-card--flat" style={{ padding: "0.85rem" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{locale === "ar" ? "صورة" : "Image"}</th>
                <th>{locale === "ar" ? "الاسم" : "Name"}</th>
                <th>{dict.admin.categories}</th>
                <th>{locale === "ar" ? "السعر" : "Price"}</th>
                <th>{locale === "ar" ? "الحالة" : "Status"}</th>
                <th>{locale === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" />
                  </td>
                  <td>
                    <strong>{pickLocalized(locale, p.nameAr, p.nameEn)}</strong>
                    <div style={{ color: "var(--admin-muted)", fontSize: "0.78rem", marginTop: 2 }}>
                      {p.slug}
                    </div>
                  </td>
                  <td>{pickLocalized(locale, p.category.nameAr, p.category.nameEn)}</td>
                  <td style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700 }}>
                    {p.units[0]
                      ? `${p.units[0].amount.toLocaleString("en-US")} ${p.units[0].currency}`
                      : "—"}
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${p.available ? "admin-badge--ok" : "admin-badge--off"}`}
                    >
                      {p.available ? dict.admin.available : dict.admin.unavailable}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link className="admin-btn admin-btn--ghost" href={`/admin/products/${p.id}`}>
                        {dict.admin.edit}
                      </Link>
                      <DeleteProductButton id={p.id} name={pickLocalized(locale, p.nameAr, p.nameEn)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
