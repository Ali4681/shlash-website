"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSelect } from "@/components/admin/AdminSelect";

type Area = {
  id: string;
  nameAr: string;
  nameEn: string;
  status: string;
  note: string | null;
  lat: number | null;
  lon: number | null;
  labelOffsetX: number | null;
  labelOffsetY: number | null;
};

const empty = {
  id: "",
  nameAr: "",
  nameEn: "",
  status: "active",
  note: "",
  lat: "",
  lon: "",
  labelOffsetX: "",
  labelOffsetY: "",
};

export default function AdminCoveragePage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [inquiryCopy, setInquiryCopy] = useState("");
  const [draft, setDraft] = useState(empty);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/cms/coverage");
    const data = await res.json();
    if (!res.ok) return;
    setAreas(data.areas ?? []);
    setInquiryCopy(data.settings?.inquiryCopy ?? "");
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveInquiry(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    const res = await fetch("/api/cms/coverage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryCopy }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "تعذر الحفظ");
      return;
    }
    setOk("تم حفظ نص الاستفسار");
  }

  async function saveArea(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const isEdit = Boolean(draft.id);
    const payload = {
      nameAr: draft.nameAr,
      nameEn: draft.nameEn,
      status: draft.status,
      note: draft.note || null,
      lat: draft.lat,
      lon: draft.lon,
      labelOffsetX: draft.labelOffsetX,
      labelOffsetY: draft.labelOffsetY,
    };
    const res = await fetch(
      isEdit ? `/api/cms/coverage/${draft.id}` : "/api/cms/coverage",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "تعذر حفظ المنطقة");
      return;
    }
    setDraft(empty);
    await load();
  }

  async function onDelete(row: Area) {
    if (!confirm(`حذف منطقة «${row.nameAr}»؟`)) return;
    const res = await fetch(`/api/cms/coverage/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "تعذر الحذف");
      return;
    }
    await load();
  }

  return (
    <AdminShell title="التغطية" subtitle="مناطق التوزيع ونص الاستفسار">
      <form className="admin-card admin-form" style={{ marginBottom: "1rem" }} onSubmit={saveInquiry}>
        {ok ? <div className="admin-msg admin-msg--ok">{ok}</div> : null}
        <div className="admin-field">
          <label>نص الاستفسار</label>
          <input value={inquiryCopy} onChange={(e) => setInquiryCopy(e.target.value)} />
        </div>
        <button className="admin-btn admin-btn--primary" type="submit" disabled={loading}>
          حفظ النص
        </button>
      </form>

      <div className="admin-card admin-form" style={{ marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>
          {draft.id ? "تعديل منطقة" : "منطقة جديدة"}
        </h2>
        {error ? <div className="admin-msg admin-msg--error">{error}</div> : null}
        <form onSubmit={saveArea}>
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
            <label>الحالة</label>
            <AdminSelect
              value={draft.status}
              onChange={(status) => setDraft({ ...draft, status })}
              options={[
                { value: "active", label: "نشطة", hint: "تغطية يومية" },
                { value: "limited", label: "محدودة", hint: "تغطية جزئية" },
                { value: "inquiry", label: "استفسار", hint: "حسب الطلب" },
              ]}
            />
          </div>
          <div className="admin-field">
            <label>ملاحظة</label>
            <input
              value={draft.note}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Latitude</label>
            <input
              value={draft.lat}
              onChange={(e) => setDraft({ ...draft, lat: e.target.value })}
              dir="ltr"
            />
          </div>
          <div className="admin-field">
            <label>Longitude</label>
            <input
              value={draft.lon}
              onChange={(e) => setDraft({ ...draft, lon: e.target.value })}
              dir="ltr"
            />
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--primary" type="submit" disabled={loading}>
              حفظ المنطقة
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
              <th>المنطقة</th>
              <th>الحالة</th>
              <th>الإحداثيات</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {areas.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.nameAr}</strong>
                  <div style={{ color: "#667", fontSize: "0.8rem" }}>{row.nameEn}</div>
                </td>
                <td>{row.status}</td>
                <td dir="ltr">
                  {row.lat != null && row.lon != null ? `${row.lat}, ${row.lon}` : "—"}
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={() =>
                        setDraft({
                          id: row.id,
                          nameAr: row.nameAr,
                          nameEn: row.nameEn,
                          status: row.status,
                          note: row.note ?? "",
                          lat: row.lat != null ? String(row.lat) : "",
                          lon: row.lon != null ? String(row.lon) : "",
                          labelOffsetX:
                            row.labelOffsetX != null ? String(row.labelOffsetX) : "",
                          labelOffsetY:
                            row.labelOffsetY != null ? String(row.labelOffsetY) : "",
                        })
                      }
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
