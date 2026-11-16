import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cairo, IBM_Plex_Sans_Arabic, Outfit } from "next/font/google";
import { company } from "@/data/company";
import { marhey } from "@/lib/fonts";
import {
  LOCALE_COOKIE,
  THEME_COOKIE,
  localeDir,
  parseLocale,
  parseTheme,
} from "@/lib/prefs";
import { PrefsProvider } from "@/components/providers/PrefsProvider";
import "./globals.css";
import "./site-dark.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/** Acumin is commercial — Outfit stands in via --font-acumin until licensed files are added. */
const acumin = Outfit({
  variable: "--font-acumin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plex = IBM_Plex_Sans_Arabic({
  variable: "--font-plex",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

/** Somar fallback: Cairo. Drop Somar files into /public/fonts and wire @font-face as --font-somar. */
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/** Cookie-backed locale/theme — allow blocking render for prefs. */
export const instant = false;

/** Static metadata only — Prisma in generateMetadata blocks admin routes under cacheComponents. */
export const metadata: Metadata = {
  metadataBase: new URL("https://shlash.com"),
  title: `${company.nameAr} · ${company.roleAr}`,
  description: company.intro,
  openGraph: {
    title: `${company.nameAr} · ${company.roleAr}`,
    description: company.intro,
    locale: "ar_SY",
    type: "website",
    images: [{ url: "/media/logo.png" }],
  },
};

const prefsBootScript = `(()=>{try{var c=document.cookie||'';var g=function(n){var m=c.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):''};var l=g('shlash_locale');var t=g('shlash_theme');if(l!=='ar'&&l!=='en')l='ar';if(t!=='light'&&t!=='dark')t='light';var r=document.documentElement;r.lang=l;r.dir=l==='ar'?'rtl':'ltr';r.dataset.theme=t;r.style.colorScheme=t;}catch(e){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const jar = await cookies();
  const locale = parseLocale(jar.get(LOCALE_COOKIE)?.value);
  const theme = parseTheme(jar.get(THEME_COOKIE)?.value);
  const dir = localeDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme={theme}
      className={`${outfit.variable} ${acumin.variable} ${plex.variable} ${cairo.variable} ${marhey.variable} h-full antialiased`}
      style={
        {
          ["--font-somar" as string]: "var(--font-cairo)",
          colorScheme: theme,
        } as CSSProperties
      }
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsBootScript }} />
      </head>
      <body
        className="min-h-full flex flex-col bg-ice text-navy"
        suppressHydrationWarning
      >
        <PrefsProvider locale={locale} theme={theme}>
          {children}
        </PrefsProvider>
      </body>
    </html>
  );
}
