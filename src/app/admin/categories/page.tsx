"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type Category = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
};

const empty = { id: "", slug: "", nameAr: "", nameEn: "" };

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Category[]>([]);
  const [draft, setDraft] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/cms/categories");
    const data = await res.json();
    if (res.ok) setRows(data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const isEdit = Boolean(draft.id);
    const res = await fetch(
      isEdit ? `/api/cms/categories/${draft.id}` : "/api/cms/categories",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      },
    );
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "تعذر الحفظ");
      return;
    }
    setDraft(empty);
    await load();
  }

  async function onDelete(row: Category) {
    if (!confirm(`حذف الفئة «${row.nameAr}»؟`)) return;
    const res = await fetch(`/api/cms/categories/${row.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "تعذر الحذف");
      return;
    }
    await load();
  }

  return (
    <AdminShell title="الفئات" subtitle="إدارة فئات المنتجات">
      <div className="admin-card admin-form" style={{ marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>
          {draft.id ? "تعديل فئة" : "فئة جديدة"}
        </h2>
        {error ? <div className="admin-msg admin-msg--error">{error}</div> : null}
        <form onSubmit={onSubmit}>
          <div className="admin-field">
            <label>الاسم بالعربي</label>
            <input
              value={draft.nameAr}
              onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label>الاسم بالإنجليزي</label>
            <input
              value={draft.nameEn}
              onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label>Slug</label>
            <input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              required
              dir="ltr"
            />
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--primary" type="submit" disabled={loading}>
              حفظ
            </button>
            {draft.id ? (
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setDraft(empty)}
              >
                إلغاء
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>العربي</th>
              <th>الإنجليزي</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.nameAr}</td>
                <td>{row.nameEn}</td>
                <td dir="ltr">{row.slug}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={() => setDraft(row)}
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() => void onDelete(row)}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
