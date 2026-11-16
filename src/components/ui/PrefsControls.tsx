"use client";

import { cn } from "@/lib/cn";
import { usePrefs } from "@/components/providers/PrefsProvider";
import "./prefs-controls.css";

export function PrefsControls({
  className,
  tone = "site",
}: {
  className?: string;
  tone?: "site" | "admin" | "admin-side";
}) {
  const { locale, theme, dict, toggleLocale, toggleTheme } = usePrefs();

  return (
    <div className={cn("prefs-controls", `prefs-controls--${tone}`, className)} role="group">
      <button
        type="button"
        className="prefs-btn"
        onClick={toggleLocale}
        aria-label={dict.locale.toggle}
        title={dict.locale.toggle}
      >
        <span className="prefs-btn__code">{locale === "ar" ? "EN" : "ع"}</span>
        <span className="prefs-btn__label">
          {locale === "ar" ? dict.locale.en : dict.locale.ar}
        </span>
      </button>

      <button
        type="button"
        className="prefs-btn"
        onClick={toggleTheme}
        aria-label={dict.theme.toggle}
        title={theme === "dark" ? dict.theme.light : dict.theme.dark}
      >
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none">
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none">
            <path
              d="M20 13.4A7.4 7.4 0 0 1 10.6 4 7.8 7.8 0 1 0 20 13.4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span className="prefs-btn__label">
          {theme === "dark" ? dict.theme.light : dict.theme.dark}
        </span>
      </button>
    </div>
  );
}
