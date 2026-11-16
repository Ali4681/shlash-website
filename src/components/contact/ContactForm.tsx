"use client";

import { useMemo, useState } from "react";
import {
  contactPurposes,
  type ContactPurposeId,
} from "@/data/contact";
import { Button } from "@/components/ui/Button";
import { usePrefs } from "@/components/providers/PrefsProvider";

export function ContactForm() {
  const { dict } = usePrefs();
  const [purpose, setPurpose] = useState<ContactPurposeId>("general");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const needsShop = purpose === "visit";
  const title = useMemo(
    () => dict.contactForm.purposes[purpose] ?? purpose,
    [dict.contactForm.purposes, purpose],
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
          {dict.contactForm.messageEyebrow}
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
            {dict.contactForm.purposes[p.id] ?? p.labelAr}
          </label>
        ))}
      </fieldset>

      <label className="grid gap-1">
        <span className="text-sm text-[var(--muted)]">{dict.contactForm.name}</span>
        <input required name="name" className="field" />
      </label>
      <label className="grid gap-1">
        <span className="text-sm text-[var(--muted)]">{dict.contactForm.reply}</span>
        <input required name="reply" className="field" />
      </label>
      {needsShop && (
        <>
          <label className="grid gap-1">
            <span className="text-sm text-[var(--muted)]">{dict.contactForm.shop}</span>
            <input required name="shop" className="field" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-[var(--muted)]">{dict.contactForm.area}</span>
            <input required name="area" className="field" />
          </label>
        </>
      )}
      <label className="grid gap-1">
        <span className="text-sm text-[var(--muted)]">{dict.contactForm.message}</span>
        <textarea required name="message" rows={4} className="field resize-y" />
      </label>

      <Button type="submit" className="w-fit">
        {status === "loading" ? dict.contactForm.sending : dict.contactForm.send}
      </Button>
      {status === "done" && (
        <p className="text-[var(--blue)]">{dict.contactForm.done}</p>
      )}
      {status === "error" && (
        <p className="text-red-600">{dict.contactForm.error}</p>
      )}
    </form>
  );
}
