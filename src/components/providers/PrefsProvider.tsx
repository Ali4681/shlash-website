"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  LOCALE_COOKIE,
  PREFS_MAX_AGE,
  THEME_COOKIE,
  localeDir,
  type Locale,
  type Theme,
} from "@/lib/prefs";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

type PrefsContextValue = {
  locale: Locale;
  theme: Theme;
  dir: "rtl" | "ltr";
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleLocale: () => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${PREFS_MAX_AGE}; samesite=lax`;
}

function applyDom(locale: Locale, theme: Theme) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = localeDir(locale);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function PrefsProvider({
  locale,
  theme,
  children,
}: {
  locale: Locale;
  theme: Theme;
  children: ReactNode;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const dict = useMemo(() => getDictionary(locale), [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      writeCookie(LOCALE_COOKIE, next);
      applyDom(next, theme);
      startTransition(() => router.refresh());
    },
    [router, theme],
  );

  const setTheme = useCallback(
    (next: Theme) => {
      writeCookie(THEME_COOKIE, next);
      applyDom(locale, next);
      startTransition(() => router.refresh());
    },
    [locale, router],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  const value = useMemo<PrefsContextValue>(
    () => ({
      locale,
      theme,
      dir: localeDir(locale),
      dict,
      setLocale,
      setTheme,
      toggleTheme,
      toggleLocale,
    }),
    [dict, locale, setLocale, setTheme, theme, toggleLocale, toggleTheme],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
  return ctx;
}
