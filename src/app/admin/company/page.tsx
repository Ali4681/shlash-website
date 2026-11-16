"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type Fact = { id: string; icon: string; label: string; value: string };

type CompanyDraft = {
  nameAr: string;
  nameEn: string;
  legalName: string;
  roleAr: string;
  roleEn: string;
  intro: string;
  aboutLead: string;
  aboutBodyText: string;
  servesText: string;
  partnerNamesText: string;
  foundedYear: string;
  clientCount: string;
  facts: Fact[];
};

const empty: CompanyDraft = {
  nameAr: "",
  nameEn: "",
  legalName: "",
  roleAr: "",
  roleEn: "",
  intro: "",
  aboutLead: "",
  aboutBodyText: "",
  servesText: "",
  partnerNamesText: "",
  foundedYear: "",
  clientCount: "",
  facts: [],
};

export default function AdminCompanyPage() {
  const [draft, setDraft] = useState<CompanyDraft>(empty);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/cms/company");
      const data = await res.json();
      if (!res.ok || !data) return;
      setDraft({
        nameAr: data.nameAr ?? "",
        nameEn: data.nameEn ?? "",
        legalName: data.legalName ?? "",
        roleAr: data.roleAr ?? "",
        roleEn: data.roleEn ?? "",
        intro: data.intro ?? "",
        aboutLead: data.aboutLead ?? "",
        aboutBodyText: Array.isArray(data.aboutBody) ? data.aboutBody.join("\n") : "",
        servesText: Array.isArray(data.serves) ? data.serves.join("\n") : "",
        partnerNamesText: Array.isArray(data.partnerNames)
          ? data.partnerNames.join("\n")
          : "",
        foundedYear: data.foundedYear != null ? String(data.foundedYear) : "",
        clientCount: data.clientCount != null ? String(data.clientCount) : "",
        facts: Array.isArray(data.factsJson) ? data.factsJson : [],
      });
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    const res = await fetch("/api/cms/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameAr: draft.nameAr,
        nameEn: draft.nameEn,
        legalName: draft.legalName,
        roleAr: draft.roleAr,
        roleEn: draft.roleEn,
        intro: draft.intro,
        aboutLead: draft.aboutLead,
        aboutBody: draft.aboutBodyText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        serves: draft.servesText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        partnerNames: draft.partnerNamesText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        foundedYear: draft.foundedYear,
        clientCount: draft.clientCount,
        factsJson: draft.facts,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "تعذر الحفظ");
      return;
    }
    setOk("تم حفظ بيانات الشركة");
  }

  return (
    <AdminShell title="الشركة" subtitle="من نحن والحقائق التعريفية">
      <form className="admin-card admin-form" onSubmit={onSubmit}>
        {error ? <div className="admin-msg admin-msg--error">{error}</div> : null}
        {ok ? <div className="admin-msg admin-msg--ok">{ok}</div> : null}
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
          <label>الاسم القانوني</label>
          <input
            value={draft.legalName}
            onChange={(e) => setDraft({ ...draft, legalName: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>الدور بالعربي</label>
          <input
            value={draft.roleAr}
            onChange={(e) => setDraft({ ...draft, roleAr: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>الدور بالإنجليزي</label>
          <input
            value={draft.roleEn}
            onChange={(e) => setDraft({ ...draft, roleEn: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>المقدمة</label>
          <textarea
            value={draft.intro}
            onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>نبذة عنّا</label>
          <textarea
            value={draft.aboutLead}
            onChange={(e) => setDraft({ ...draft, aboutLead: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>فقرات عنّا (سطر لكل فقرة)</label>
          <textarea
            value={draft.aboutBodyText}
            onChange={(e) => setDraft({ ...draft, aboutBodyText: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>نخدم (سطر لكل عنصر)</label>
          <textarea
            value={draft.servesText}
            onChange={(e) => setDraft({ ...draft, servesText: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>شركاء (سطر لكل اسم)</label>
          <textarea
            value={draft.partnerNamesText}
            onChange={(e) => setDraft({ ...draft, partnerNamesText: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>سنة التأسيس</label>
          <input
            value={draft.foundedYear}
            onChange={(e) => setDraft({ ...draft, foundedYear: e.target.value })}
            dir="ltr"
          />
        </div>
        <div className="admin-field">
          <label>عدد العملاء</label>
          <input
            value={draft.clientCount}
            onChange={(e) => setDraft({ ...draft, clientCount: e.target.value })}
            dir="ltr"
          />
        </div>

        <div className="admin-field">
          <label>الحقائق</label>
          <div className="admin-units">
            {draft.facts.map((f, i) => (
              <div className="admin-unit-row" key={f.id || i}>
                <input
                  value={f.label}
                  placeholder="التسمية"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      facts: draft.facts.map((row, idx) =>
                        idx === i ? { ...row, label: e.target.value } : row,
                      ),
                    })
                  }
                />
                <input
                  value={f.value}
                  placeholder="القيمة"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      facts: draft.facts.map((row, idx) =>
                        idx === i ? { ...row, value: e.target.value } : row,
                      ),
                    })
                  }
                />
                <input
                  value={f.icon}
                  placeholder="icon"
                  dir="ltr"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      facts: draft.facts.map((row, idx) =>
                        idx === i ? { ...row, icon: e.target.value } : row,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className="admin-btn admin-btn--danger"
                  onClick={() =>
                    setDraft({ ...draft, facts: draft.facts.filter((_, idx) => idx !== i) })
                  }
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() =>
                setDraft({
                  ...draft,
                  facts: [
                    ...draft.facts,
                    { id: `fact-${Date.now()}`, icon: "truck", label: "", value: "" },
                  ],
                })
              }
            >
              إضافة حقيقة
            </button>
          </div>
        </div>

        <button className="admin-btn admin-btn--primary" type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ"}
        </button>
      </form>
    </AdminShell>
  );
}
