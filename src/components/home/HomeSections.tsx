"use client";

import type { Product } from "@/data/catalog";
import type { ContactChannel, SocialLink } from "@/data/contact";
import type { CoverageArea } from "@/data/coverage";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Button } from "@/components/ui/Button";
import { ContactCards } from "@/components/contact/ContactCards";
import { LandingMotion } from "@/components/home/LandingMotion";
import { CoverageMap } from "@/components/home/CoverageMap";
import { FactIcon } from "@/components/home/FactIcon";
import {
  AboutBackground,
  ContactBackground,
  CoverageBackground,
  ProductsBackground,
  SectionWaveDivider,
  WhoBackground,
} from "@/components/backgrounds";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { pickLocalized } from "@/lib/i18n/dictionaries";
import "./who-facts.css";

type Company = {
  intro: string;
  aboutLead: string;
  aboutBody: string[];
  serves: string[];
  facts: {
    id: string;
    icon: "truck" | "biscuit" | "source" | "store";
    label: string;
    labelEn?: string;
    value: string;
    valueEn?: string;
  }[];
};

type Contact = {
  hoursAr: string;
  hoursEn?: string;
  addressAr: string;
  addressEn?: string;
  channels: ContactChannel[];
  social: SocialLink[];
};

type Category = { id: string; nameAr: string; nameEn?: string };
type Brand = { id: string; nameAr: string; nameEn?: string };

export function HomeSections({
  products,
  categories,
  brands,
  company,
  contact,
  coverageAreas,
  coverageInquiryCopy,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  company: Company;
  contact: Contact;
  coverageAreas: CoverageArea[];
  coverageInquiryCopy: string;
}) {
  const { locale, dict } = usePrefs();
  const catalog = products.filter((p) => p.available);
  const promoSlug = catalog[1]?.slug;

  const intro = locale === "en" ? dict.content.intro : company.intro || dict.content.intro;
  const aboutLead =
    locale === "en" ? dict.content.aboutLead : company.aboutLead || dict.content.aboutLead;
  const aboutBody =
    locale === "en"
      ? dict.content.aboutBody
      : company.aboutBody?.length
        ? company.aboutBody
        : dict.content.aboutBody;
  const serves =
    locale === "en"
      ? dict.content.serves
      : company.serves?.length
        ? company.serves
        : dict.content.serves;
  const hours = pickLocalized(locale, contact.hoursAr, contact.hoursEn);
  const address = pickLocalized(locale, contact.addressAr, contact.addressEn);
  const inquiryCopy = coverageInquiryCopy?.trim()
    ? locale === "en"
      ? dict.coverage.inquiry
      : coverageInquiryCopy
    : dict.coverage.inquiry;

  return (
    <>
      <LandingMotion />

      <section id="who" className="section relative overflow-hidden bg-ice text-navy">
        <WhoBackground />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.5rem))]">
          <div className="section-head max-w-2xl">
            <h2 className="section-title">{dict.who.title}</h2>
            <p className="section-lead">{intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#about">{dict.who.aboutCta}</Button>
              <Button href="#products" variant="secondary">
                {dict.who.productsCta}
              </Button>
            </div>
          </div>

          <div className="fact-grid mt-10">
            {company.facts.map((f) => {
              const dictFact = dict.content.facts[f.id];
              const label = pickLocalized(
                locale,
                f.label,
                f.labelEn ?? dictFact?.label,
              );
              const value = pickLocalized(
                locale,
                f.value,
                f.valueEn ?? dictFact?.value,
              );
              return (
                <div key={f.id} className="fact-item">
                  <span className="fact-icon">
                    <FactIcon name={f.icon} />
                  </span>
                  <div>
                    <p className="fact-item__value">{value}</p>
                    <p className="fact-item__label">{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionWaveDivider from="ice" to="white" />

      <section id="products" className="section relative overflow-hidden bg-white text-navy">
        <ProductsBackground />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.5rem))]">
          <div className="section-head max-w-2xl">
            <h2 className="section-title">{dict.products.title}</h2>
            <p className="section-lead">{dict.products.lead}</p>
            <p className="mt-3 text-sm text-navy/55">
              {categories
                .map((c) => pickLocalized(locale, c.nameAr, c.nameEn))
                .join(" · ")}
              {brands.length
                ? ` · ${brands.map((b) => pickLocalized(locale, b.nameAr, b.nameEn)).join(" · ")}`
                : ""}
            </p>
          </div>

          <div className="shelf mt-10">
            <div className="mb-5 flex items-end justify-between gap-3">
              <p className="m-0 text-sm font-semibold text-navy/55">{dict.products.shelf}</p>
              <p className="m-0 font-en text-[0.68rem] uppercase tracking-[0.14em] text-navy/40">
                {dict.products.skuCount.replace("{n}", String(catalog.length))}
              </p>
            </div>
            <div className="shelf shelf--packs grid grid-cols-2 gap-x-2.5 gap-y-5 pt-2 sm:gap-x-4 sm:gap-y-7 sm:pt-3 lg:grid-cols-3">
              {catalog.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  promo={p.slug === promoSlug}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionWaveDivider from="white" to="navy" />

      <section id="coverage" className="section relative overflow-hidden bg-navy text-white">
        <CoverageBackground />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.5rem))]">
          <div className="section-head max-w-xl">
            <h2 className="section-title section-title--on-dark">{dict.coverage.title}</h2>
            <p className="section-lead section-lead--on-dark">{dict.coverage.lead}</p>
          </div>

          {coverageAreas.length ? (
            <div className="mt-10">
              <CoverageMap areas={coverageAreas} />
            </div>
          ) : (
            <p className="mt-8 text-white/70">{inquiryCopy}</p>
          )}

          <div className="mt-10">
            <Button href="#contact">{inquiryCopy}</Button>
          </div>
        </div>
      </section>

      <SectionWaveDivider from="navy" to="ice" />

      <section id="about" className="section relative overflow-hidden bg-ice text-navy">
        <AboutBackground />
        <div className="relative z-10 mx-auto grid w-[min(1200px,calc(100%-2.5rem))] gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="section-head">
            <h2 className="section-title">{dict.about.title}</h2>
            <p className="section-lead">{aboutLead}</p>
            <div className="mt-5 grid gap-4">
              {aboutBody.map((p, i) => (
                <p key={`about-body-${i}`} className="m-0 leading-8 text-navy/70">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="font-en text-xs uppercase tracking-[0.16em] text-navy/50">
              {dict.about.serves}
            </p>
            <ul className="mt-4 grid list-none gap-3 p-0">
              {serves.map((s, i) => (
                <li key={`serve-${i}`} className="border-s-2 border-orange ps-3 text-lg">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SectionWaveDivider from="ice" to="white" />

      <section id="contact" className="section relative overflow-hidden bg-white text-navy">
        <ContactBackground />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.5rem))]">
          <div className="section-head max-w-2xl">
            <p className="contact-cta__eyebrow">{dict.contact.eyebrow}</p>
            <h2 className="section-title">{dict.contact.title}</h2>
            <p className="section-lead">{dict.contact.lead}</p>
            <p className="mt-3 text-sm text-navy/55">
              {hours} · {address}
            </p>
          </div>
          <div className="mt-9">
            <ContactCards channels={contact.channels} />
          </div>
        </div>
      </section>
    </>
  );
}
