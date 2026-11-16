"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { productFlavors } from "@/data/catalog";
import { AdminSelect } from "@/components/admin/AdminSelect";

type UnitDraft = {
  labelAr: string;
  labelEn: string;
  packCount: number;
  amount: number;
  currency: string;
};

type Props = {
  mode: "create" | "edit";
  productId?: string;
  categories: { id: string; nameAr: string }[];
  brands: { id: string; nameAr: string }[];
  initial?: {
    nameAr: string;
    nameEn: string;
    slug: string;
    descriptionAr: string;
    categoryId: string;
    brandId: string;
    weight?: string | null;
    accent?: string | null;
    featured: boolean;
    available: boolean;
    flavors: string[];
    image: string;
    units: UnitDraft[];
  };
};

const emptyUnit = (): UnitDraft => ({
  labelAr: "علبة",
  labelEn: "Pack",
  packCount: 1,
  amount: 0,
  currency: "SYP",
});

export function ProductForm({ mode, productId, categories, brands, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const [flavors, setFlavors] = useState<string[]>(initial?.flavors ?? []);
  const [units, setUnits] = useState<UnitDraft[]>(
    initial?.units?.length ? initial.units : [emptyUnit()],
  );
  const [imagePath] = useState(initial?.image ?? "");

  const title = useMemo(
    () => (mode === "create" ? "منتج جديد" : "تعديل منتج"),
    [mode],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    const form = new FormData(e.currentTarget);
    form.set("flavors", flavors.join(","));
    form.set("units", JSON.stringify(units));
    form.set("imagePath", imagePath);
    form.set("featured", form.get("featured") ? "true" : "false");
    form.set("available", form.get("available") ? "true" : "false");

    const url =
      mode === "create" ? "/api/cms/products" : `/api/cms/products/${productId}`;
    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PUT",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "تعذر الحفظ");
      return;
    }
    setOk("تم الحفظ بنجاح");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form className="admin-card admin-form" onSubmit={onSubmit}>
      <div className="admin-panel-head">
        <div>
          <h2>{title}</h2>
          <p>الحقول الأساسية تظهر مباشرة على رف المنتجات في الموقع.</p>
        </div>
      </div>
      {error ? <div className="admin-msg admin-msg--error">{error}</div> : null}
      {ok ? <div className="admin-msg admin-msg--ok">{ok}</div> : null}

      <div className="admin-form-grid">
        <div className="admin-field">
          <label>الاسم بالعربي</label>
          <input name="nameAr" defaultValue={initial?.nameAr} required />
        </div>
        <div className="admin-field">
          <label>الاسم بالإنجليزي</label>
          <input name="nameEn" defaultValue={initial?.nameEn} required />
        </div>
        <div className="admin-field">
          <label>Slug</label>
          <input name="slug" defaultValue={initial?.slug} required dir="ltr" />
        </div>
        <div className="admin-field">
          <label>الوزن</label>
          <input name="weight" defaultValue={initial?.weight ?? ""} />
        </div>
        <div className="admin-field admin-field--full">
          <label>الوصف</label>
          <textarea name="descriptionAr" defaultValue={initial?.descriptionAr} required />
        </div>
        <div className="admin-field">
          <label>الفئة</label>
          <AdminSelect
            name="categoryId"
            required
            defaultValue={initial?.categoryId ?? categories[0]?.id ?? ""}
            options={categories.map((c) => ({ value: c.id, label: c.nameAr }))}
            placeholder="اختر الفئة"
          />
        </div>
        <div className="admin-field">
          <label>الماركة</label>
          <AdminSelect
            name="brandId"
            required
            defaultValue={initial?.brandId ?? brands[0]?.id ?? ""}
            options={brands.map((b) => ({ value: b.id, label: b.nameAr }))}
            placeholder="اختر الماركة"
          />
        </div>
        <div className="admin-field">
          <label>لون التمييز (hex)</label>
          <input
            name="accent"
            defaultValue={initial?.accent ?? ""}
            dir="ltr"
            placeholder="#0443b2"
          />
        </div>
        <div className="admin-field">
          <label>صورة المنتج</label>
          {imagePath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePath}
              alt=""
              style={{
                width: 104,
                height: 104,
                objectFit: "contain",
                borderRadius: "0.85rem",
                border: "1px solid var(--admin-line)",
                background: "#f7f8fc",
                padding: 6,
              }}
            />
          ) : null}
          <input name="image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
        </div>
      </div>

      <div className="admin-actions">
        <label className="admin-check">
          <input name="featured" type="checkbox" defaultChecked={initial?.featured} />
          منتج مميز
        </label>
        <label className="admin-check">
          <input name="available" type="checkbox" defaultChecked={initial?.available ?? true} />
          متوفر
        </label>
      </div>

      <div className="admin-field">
        <label>النكهات</label>
        <div className="admin-actions">
          {productFlavors.map((f) => {
            const on = flavors.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                className={`admin-btn ${on ? "admin-btn--primary" : "admin-btn--ghost"}`}
                onClick={() =>
                  setFlavors((prev) =>
                    on ? prev.filter((x) => x !== f.id) : [...prev, f.id],
                  )
                }
              >
                {f.nameAr}
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-field">
        <label>وحدات البيع</label>
        <div className="admin-units">
          {units.map((u, i) => (
            <div className="admin-unit-row" key={i}>
              <input
                value={u.labelAr}
                onChange={(e) =>
                  setUnits((prev) =>
                    prev.map((row, idx) =>
                      idx === i ? { ...row, labelAr: e.target.value } : row,
                    ),
                  )
                }
                placeholder="علبة"
              />
              <input
                value={u.labelEn}
                onChange={(e) =>
                  setUnits((prev) =>
                    prev.map((row, idx) =>
                      idx === i ? { ...row, labelEn: e.target.value } : row,
                    ),
                  )
                }
                placeholder="Pack"
                dir="ltr"
              />
              <input
                type="number"
                value={u.packCount}
                onChange={(e) =>
                  setUnits((prev) =>
                    prev.map((row, idx) =>
                      idx === i ? { ...row, packCount: Number(e.target.value) } : row,
                    ),
                  )
                }
              />
              <input
                type="number"
                value={u.amount}
                onChange={(e) =>
                  setUnits((prev) =>
                    prev.map((row, idx) =>
                      idx === i ? { ...row, amount: Number(e.target.value) } : row,
                    ),
                  )
                }
              />
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => setUnits((prev) => prev.filter((_, idx) => idx !== i))}
              >
                حذف
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => setUnits((prev) => [...prev, emptyUnit()])}
          >
            إضافة وحدة
          </button>
        </div>
      </div>

      <div className="admin-actions">
        <button className="admin-btn admin-btn--primary" type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => router.push("/admin/products")}
        >
          رجوع
        </button>
      </div>
    </form>
  );
}
