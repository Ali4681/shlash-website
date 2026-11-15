import Image from "next/image";
import { company } from "@/data/company";
import { contactSettings } from "@/data/contact";
import { nav, site } from "@/data/site";
import { FooterBackground } from "@/components/backgrounds";
import "./header.css";

function SocialIcon({ id }: { id: string }) {
  if (id === "instagram") {
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

export function Footer() {
  const channels = contactSettings.channels.filter((c) => c.enabled);
  const social = contactSettings.social.filter((s) => s.enabled);

  return (
    <footer className="relative overflow-hidden bg-navy text-white/75">
      <FooterBackground />
      <div className="relative z-10 mx-auto grid w-[min(1200px,calc(100%-2.5rem))] gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_0.9fr_0.7fr]">
        <div>
          <a href="#top" className="site-header__brand" aria-label={site.nameAr}>
            <span className="site-header__logo-wrap site-header__logo-wrap--on-dark">
              <Image
                src="/media/character.png"
                alt={site.nameAr}
                width={96}
                height={96}
                className="site-header__logo"
              />
            </span>
            <span className="site-header__brand-text site-header__brand-text--footer">
              <strong className="site-header__brand-name text-white">{site.nameAr}</strong>
              <span className="site-header__brand-role text-white/55">{site.roleEn}</span>
            </span>
          </a>
          <p className="mt-3 max-w-xs text-sm leading-7 text-white/60">{company.roleAr}</p>
        </div>

        <div>
          <p className="m-0 font-en text-[0.68rem] uppercase tracking-[0.16em] text-white/45">
            Explore
          </p>
          <ul className="mt-3 grid list-none gap-2 p-0 text-sm">
            {nav.map((item) => (
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
            Contact
          </p>
          <ul className="mt-3 grid list-none gap-2 p-0 text-sm">
            {channels.map((ch) => (
              <li key={ch.id}>
                <a href={ch.href} className="hover:text-white">
                  {ch.labelAr}:{" "}
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {ch.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {social.length > 0 && (
          <div>
            <p className="m-0 font-en text-[0.68rem] uppercase tracking-[0.16em] text-white/45">
              Social
            </p>
            <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
              {social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/75 transition hover:border-white/35 hover:text-white"
                    aria-label={s.labelAr}
                  >
                    <SocialIcon id={s.id} />
                    <span>{s.labelAr}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="relative z-10 mx-auto flex w-[min(1200px,calc(100%-2.5rem))] flex-col gap-2 border-t border-white/10 py-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 font-en uppercase tracking-[0.12em]">© 2026 {company.nameEn}</p>
        <p className="m-0">{contactSettings.hoursAr}</p>
      </div>
    </footer>
  );
}
