export type Locale = "ar" | "en";
export type Theme = "light" | "dark";

export const LOCALE_COOKIE = "shlash_locale";
export const THEME_COOKIE = "shlash_theme";

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function parseLocale(value?: string | null): Locale {
  return isLocale(value) ? value : "ar";
}

export function parseTheme(value?: string | null): Theme {
  return isTheme(value) ? value : "light";
}

export const PREFS_MAX_AGE = 60 * 60 * 24 * 365;
