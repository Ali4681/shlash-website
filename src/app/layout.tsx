import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic, Outfit } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { company } from "@/data/company";
import { marhey } from "@/lib/fonts";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${outfit.variable} ${acumin.variable} ${plex.variable} ${cairo.variable} ${marhey.variable} h-full antialiased`}
      style={
        {
          ["--font-somar" as string]: "var(--font-cairo)",
        } as CSSProperties
      }
    >
      <body
        className="min-h-full flex flex-col bg-ice text-navy"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(location.hash&&location.hash!=='#top'){history.replaceState(null,'',location.pathname+location.search)}window.scrollTo(0,0)}catch(e){}`,
          }}
        />
        <SmoothScroll>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
