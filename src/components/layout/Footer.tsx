"use client";

import Image from "next/image";
import type { ContactChannel, SocialLink } from "@/data/contact";
import { FooterBackground, SectionWaveDivider } from "@/components/backgrounds";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { pickLocalized } from "@/lib/i18n/dictionaries";
import "./header.css";

function SocialIcon({ id }: { id: string }) {
  if (id === "instagram" || id.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

type SiteInfo = {
  nameAr: string;
  nameEn: string;
  roleEn: string;
  roleAr: string;
};

type CompanyInfo = {
  nameEn: string;
  nameAr: string;
  roleAr: string;
  roleEn: string;
};

type ContactInfo = {
  hoursAr: string;
  hoursEn: string;
  channels: ContactChannel[];
  social: SocialLink[];
};

export function Footer({
  site,
  company,
  nav,
  contact,
}: {
  site: SiteInfo;
  company: CompanyInfo;
  nav: { href: string; label: string }[];
  contact: ContactInfo;
}) {
  const { locale, dict } = usePrefs();
  const brandName = pickLocalized(locale, site.nameAr, site.nameEn);
  const brandRole = pickLocalized(locale, site.roleAr, site.roleEn);
  const companyRole = pickLocalized(locale, company.roleAr, company.roleEn);
  const companyNameEn = company.nameEn;
  const hours = pickLocalized(locale, contact.hoursAr, contact.hoursEn);
  const channels = contact.channels.filter((c) => c.enabled);
  const social = contact.social.filter((s) => s.enabled);
  const companyLabel = pickLocalized(locale, company.nameAr, company.nameEn);
  const localizedNav = nav.map((item) => ({
    ...item,
    label: dict.nav[item.href] ?? item.label,
  }));

  return (
    <footer className="site-footer relative mt-auto shrink-0 overflow-hidden bg-navy text-white/75">
      <SectionWaveDivider from="white" to="navy" />
      <FooterBackground />
      <div className="relative z-10 mx-auto grid w-[min(1200px,calc(100%-2.5rem))] gap-8 pb-10 pt-2 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_0.9fr_0.7fr]">
        <div>
          <a href="#top" className="site-header__brand" aria-label={brandName}>
            <span className="site-header__logo-wrap site-header__logo-wrap--on-dark">
              <Image
                src="/media/character.png"
                alt={brandName}
                width={96}
                height={96}
                className="site-header__logo"
              />
            </span>
            <span className="site-header__brand-text site-header__brand-text--footer">
              <strong className="site-header__brand-name text-white">{brandName}</strong>
              <span className="site-header__brand-role text-white/55">{brandRole}</span>
            </span>
          </a>
          <p className="mt-3 max-w-xs text-sm leading-7 text-white/60">{companyRole}</p>
        </div>

        <div>
          <p className="m-0 font-en text-[0.68rem] uppercase tracking-[0.16em] text-white/45">
            {dict.footer.explore}
          </p>
          <ul className="mt-3 grid list-none gap-2 p-0 text-sm">
            {localizedNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="m-0 font-en text-[0.68rem] uppercase tracking-[0.16em] text-white/45">
            {dict.footer.contact}
          </p>
          <ul className="mt-3 grid list-none gap-2 p-0 text-sm">
            {channels.map((ch) => {
              const typeLabel =
                ch.type === "whatsapp"
                  ? dict.contactCards.whatsappTitle
                  : ch.type === "phone"
                    ? dict.contactCards.phoneTitle
                    : dict.contactCards.emailTitle;
              const channelLabel = pickLocalized(
                locale,
                ch.labelAr,
                ch.labelEn ?? typeLabel,
              );
              return (
                <li key={ch.id}>
                  <a href={ch.href} className="hover:text-white">
                    {channelLabel}:{" "}
                    <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                      {ch.value}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {social.length > 0 && (
          <div>
            <p className="m-0 font-en text-[0.68rem] uppercase tracking-[0.16em] text-white/45">
              {dict.footer.social}
            </p>
            <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
              {social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/75 transition hover:border-white/35 hover:text-white"
                    aria-label={pickLocalized(locale, s.labelAr, s.labelEn)}
                  >
                    <SocialIcon id={s.id} />
                    <span>{pickLocalized(locale, s.labelAr, s.labelEn)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="relative z-10 mx-auto flex w-[min(1200px,calc(100%-2.5rem))] flex-col gap-2 border-t border-white/10 pb-5 pt-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 font-en uppercase tracking-[0.12em]">
          © 2026 {companyLabel || companyNameEn}
        </p>
        <p className="m-0">{hours}</p>
      </div>
    </footer>
  );
}
