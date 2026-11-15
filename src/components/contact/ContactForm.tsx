"use client";

import { useMemo, useState } from "react";
import {
  contactPurposes,
  type ContactPurposeId,
} from "@/data/contact";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [purpose, setPurpose] = useState<ContactPurposeId>("general");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const needsShop = purpose === "visit";
  const title = useMemo(
    () => contactPurposes.find((p) => p.id === purpose)?.labelAr,
    [purpose],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 700));
      setStatus("done");
      (e.target as HTMLFormElement).reset();
      setPurpose("general");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div>
        <p className="font-en text-xs tracking-[0.16em] uppercase text-[var(--muted)]">
          رسالة
        </p>
        <h3 className="mt-2 text-2xl font-bold text-[var(--navy)]">{title}</h3>
      </div>

      <fieldset className="purpose-grid">
        {contactPurposes.map((p) => (
          <label key={p.id} className={purpose === p.id ? "is-on" : ""}>
            <input
              type="radio"
              name="purpose"
              className="sr-only"
              checked={purpose === p.id}
              onChange={() => setPurpose(p.id)}
            />
            {p.labelAr}
          </label>
        ))}
      </fieldset>

      <label className="grid gap-1">
        <span className="text-sm text-[var(--muted)]">الاسم</span>
        <input required name="name" className="field" />
      </label>
      <label className="grid gap-1">
        <span className="text-sm text-[var(--muted)]">وسيلة الرد</span>
        <input required name="reply" className="field" />
      </label>
      {needsShop && (
        <>
          <label className="grid gap-1">
            <span className="text-sm text-[var(--muted)]">اسم المحل</span>
            <input required name="shop" className="field" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-[var(--muted)]">المنطقة</span>
            <input required name="area" className="field" />
          </label>
        </>
      )}
      <label className="grid gap-1">
        <span className="text-sm text-[var(--muted)]">الرسالة</span>
        <textarea required name="message" rows={4} className="field resize-y" />
      </label>

      <Button type="submit" className="w-fit">
        {status === "loading" ? "جارٍ الإرسال…" : "إرسال"}
      </Button>
      {status === "done" && (
        <p className="text-[var(--blue)]">تم استلام رسالتك. سنتواصل معك قريباً.</p>
      )}
      {status === "error" && <p className="text-red-600">فشل الإرسال — حاول مجدداً.</p>}
    </form>
  );
}
