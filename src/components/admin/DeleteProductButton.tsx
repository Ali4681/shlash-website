"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm(`حذف المنتج «${name}»؟`)) return;
    setLoading(true);
    const res = await fetch(`/api/cms/products/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "تعذر الحذف");
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      className="admin-btn admin-btn--danger"
      onClick={onDelete}
      disabled={loading}
    >
      حذف
    </button>
  );
}
