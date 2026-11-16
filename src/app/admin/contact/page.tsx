"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type Channel = {
  id?: string;
  type: string;
  labelAr: string;
  value: string;
  href: string;
  enabled: boolean;
};

type Social = {
  id?: string;
  labelAr: string;
  labelEn: string;
  href: string;
  enabled: boolean;
};

export default function AdminContactPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [hoursAr, setHoursAr] = useState("");
  const [hoursEn, setHoursEn] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [social, setSocial] = useState<Social[]>([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/cms/contact");
      const data = await res.json();
      if (!res.ok) return;
      setPhone(data.settings?.phone ?? "");
      setEmail(data.settings?.email ?? "");
      setAddress(data.settings?.address ?? "");
      setHoursAr(data.settings?.hoursAr ?? "");
      setHoursEn(data.settings?.hoursEn ?? "");
      setChannels(data.channels ?? []);
      setSocial(data.social ?? []);
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    const res = await fetch("/api/cms/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, email, address, hoursAr, hoursEn, channels, social }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "تعذر الحفظ");
      return;
    }
    setChannels(data.channels ?? channels);
    setSocial(data.social ?? social);
    setOk("تم حفظ بيانات التواصل");
  }

  return (
    <AdminShell title="التواصل" subtitle="الهاتف والبريد والقنوات والسوشيال">
      <form className="admin-card admin-form" onSubmit={onSubmit}>
        {error ? <div className="admin-msg admin-msg--error">{error}</div> : null}
        {ok ? <div className="admin-msg admin-msg--ok">{ok}</div> : null}
        <div className="admin-field">
          <label>الهاتف</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
        </div>
        <div className="admin-field">
          <label>البريد</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
        </div>
        <div className="admin-field">
          <label>العنوان</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="admin-field">
          <label>ساعات العمل (عربي)</label>
          <input value={hoursAr} onChange={(e) => setHoursAr(e.target.value)} />
        </div>
        <div className="admin-field">
          <label>ساعات العمل (إنجليزي)</label>
          <input value={hoursEn} onChange={(e) => setHoursEn(e.target.value)} dir="ltr" />
        </div>

        <div className="admin-field">
          <label>قنوات التواصل</label>
          <div className="admin-units">
            {channels.map((c, i) => (
              <div className="admin-unit-row" key={c.id || i}>
                <input
                  value={c.type}
                  placeholder="whatsapp"
                  dir="ltr"
                  onChange={(e) =>
                    setChannels((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, type: e.target.value } : row,
                      ),
                    )
                  }
                />
                <input
                  value={c.labelAr}
                  placeholder="التسمية"
                  onChange={(e) =>
                    setChannels((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, labelAr: e.target.value } : row,
                      ),
                    )
                  }
                />
                <input
                  value={c.value}
                  placeholder="القيمة"
                  dir="ltr"
                  onChange={(e) =>
                    setChannels((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, value: e.target.value } : row,
                      ),
                    )
                  }
                />
                <input
                  value={c.href}
                  placeholder="href"
                  dir="ltr"
                  onChange={(e) =>
                    setChannels((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, href: e.target.value } : row,
                      ),
                    )
                  }
                />
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={c.enabled}
                    onChange={(e) =>
                      setChannels((prev) =>
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
                  className="admin-btn admin-btn--danger"
                  onClick={() => setChannels((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() =>
                setChannels((prev) => [
                  ...prev,
                  { type: "phone", labelAr: "", value: "", href: "", enabled: true },
                ])
              }
            >
              إضافة قناة
            </button>
          </div>
        </div>

        <div className="admin-field">
          <label>السوشيال</label>
          <div className="admin-units">
            {social.map((s, i) => (
              <div className="admin-unit-row" key={s.id || i}>
                <input
                  value={s.labelAr}
                  placeholder="عربي"
                  onChange={(e) =>
                    setSocial((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, labelAr: e.target.value } : row,
                      ),
                    )
                  }
                />
                <input
                  value={s.labelEn}
                  placeholder="EN"
                  dir="ltr"
                  onChange={(e) =>
                    setSocial((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, labelEn: e.target.value } : row,
                      ),
                    )
                  }
                />
                <input
                  value={s.href}
                  placeholder="href"
                  dir="ltr"
                  onChange={(e) =>
                    setSocial((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, href: e.target.value } : row,
                      ),
                    )
                  }
                />
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={(e) =>
                      setSocial((prev) =>
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
                  className="admin-btn admin-btn--danger"
                  onClick={() => setSocial((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() =>
                setSocial((prev) => [
                  ...prev,
                  { labelAr: "", labelEn: "", href: "", enabled: false },
                ])
              }
            >
              إضافة رابط
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
