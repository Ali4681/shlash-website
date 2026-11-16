"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type NavItem = {
  href: string;
  label: string;
  enabled: boolean;
};

export default function AdminNavPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/cms/nav");
      const data = await res.json();
      if (res.ok) {
        setItems(
          (data as { href: string; label: string; enabled: boolean }[]).map((n) => ({
            href: n.href,
            label: n.label,
            enabled: n.enabled,
          })),
        );
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    const res = await fetch("/api/cms/nav", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "تعذر الحفظ");
      return;
    }
    setItems(
      (data as { href: string; label: string; enabled: boolean }[]).map((n) => ({
        href: n.href,
        label: n.label,
        enabled: n.enabled,
      })),
    );
    setOk("تم حفظ قائمة التنقل");
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
      return next;
    });
  }

  return (
    <AdminShell title="التنقل" subtitle="ترتيب وتسميات قائمة الموقع">
      <form className="admin-card admin-form" onSubmit={onSubmit}>
        {error ? <div className="admin-msg admin-msg--error">{error}</div> : null}
        {ok ? <div className="admin-msg admin-msg--ok">{ok}</div> : null}
        <div className="admin-units">
          {items.map((item, i) => (
            <div className="admin-unit-row" key={`${item.href}-${i}`}>
              <input
                value={item.label}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((row, idx) =>
                      idx === i ? { ...row, label: e.target.value } : row,
                    ),
                  )
                }
                placeholder="التسمية"
              />
              <input
                value={item.href}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((row, idx) =>
                      idx === i ? { ...row, href: e.target.value } : row,
                    ),
                  )
                }
                placeholder="#products"
                dir="ltr"
              />
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, enabled: e.target.checked } : row,
                      ),
                    )
                  }
                />
                مفعّل
              </label>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => move(i, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => move(i, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
              >
                حذف
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() =>
              setItems((prev) => [...prev, { href: "#", label: "رابط جديد", enabled: true }])
            }
          >
            إضافة عنصر
          </button>
        </div>
        <button className="admin-btn admin-btn--primary" type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ"}
        </button>
      </form>
    </AdminShell>
  );
}
