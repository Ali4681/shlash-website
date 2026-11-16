"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { PrefsControls } from "@/components/ui/PrefsControls";
import "@/components/admin/admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { dict, dir } = usePrefs();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/cms/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.replace(search.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="admin-login" dir={dir}>
      <div className="admin-login__bg" aria-hidden>
        <span className="admin-login__orb admin-login__orb--a" />
        <span className="admin-login__orb admin-login__orb--b" />
      </div>

      <form className="admin-login__card admin-form" onSubmit={onSubmit}>
        <div className="admin-login__brand">
          <div className="admin-side__mark admin-side__mark--logo">
            <Image
              src="/media/character.png"
              alt={dict.brand.cms}
              width={80}
              height={80}
              className="admin-side__logo"
              priority
            />
          </div>
          <div>
            <strong style={{ display: "block", fontSize: "1.05rem" }}>{dict.brand.cms}</strong>
            <span style={{ color: "var(--admin-muted)", fontSize: "0.8rem" }}>
              {dict.brand.control}
            </span>
          </div>
          <PrefsControls tone="admin" />
        </div>

        <h1>{dict.admin.loginTitle}</h1>
        <p>{dict.admin.loginLead}</p>

        {error ? <div className="admin-msg admin-msg--error">{error}</div> : null}

        <div className="admin-field">
          <label htmlFor="username">{dict.admin.username}</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="password">{dict.admin.password}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button className="admin-btn admin-btn--primary" type="submit" disabled={loading}>
          {loading ? dict.admin.loggingIn : dict.admin.login}
        </button>

        <div className="admin-login__meta">
          <span>{dict.admin.session}</span>
          <a href="/" target="_blank" rel="noreferrer">
            {dict.admin.openSite}
          </a>
        </div>
      </form>
    </div>
  );
}
