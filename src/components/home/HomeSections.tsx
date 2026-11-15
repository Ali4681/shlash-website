"use client";

import { company } from "@/data/company";
import { brands, categories, products } from "@/data/catalog";
import { coverageAreas, coverageInquiryCopy } from "@/data/coverage";
import { contactSettings } from "@/data/contact";
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
import "./who-facts.css";

export function HomeSections() {
  const catalog = products.filter((p) => p.available);
  const promoSlug = catalog[1]?.slug;

  return (
    <>
      <LandingMotion />

      {/* مين شلاش */}
      <section id="who" className="section relative overflow-hidden bg-ice text-navy">
        <WhoBackground />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.5rem))]">
          <div className="section-head max-w-2xl">
            <h2 className="section-title">مين شلاش؟</h2>
            <p className="section-lead">{company.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#about">تعرّف على شلاش</Button>
              <Button href="#products" variant="secondary">
                اكتشف منتجاتنا
              </Button>
            </div>
          </div>

          <div className="fact-grid mt-10">
            {company.facts.map((f) => (
              <div key={f.id} className="fact-item">
                <span className="fact-icon">
                  <FactIcon name={f.icon} />
                </span>
                <div>
                  <p className="fact-item__value">{f.value}</p>
                  <p className="fact-item__label">{f.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionWaveDivider from="ice" to="white" />

      {/* المنتجات */}
      <section id="products" className="section relative overflow-hidden bg-white text-navy">
        <ProductsBackground />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.5rem))]">
          <div className="section-head max-w-2xl">
            <h2 className="section-title">شو بتوزّع اليوم؟</h2>
            <p className="section-lead">
              أصناف البسكوت من مصدر توريد واحد حالياً. شلاش هي الموزّع — والمنتجات معروضة كما على
              الرف.
            </p>
            <p className="mt-3 text-sm text-navy/55">
              {categories.map((c) => c.nameAr).join(" · ")}
              {brands.length ? ` · ${brands.map((b) => b.nameAr).join(" · ")}` : ""}
            </p>
          </div>

          <div className="shelf mt-10">
            <div className="mb-5 flex items-end justify-between gap-3">
              <p className="m-0 text-sm font-semibold text-navy/55">رف البسكوت</p>
              <p className="m-0 font-en text-[0.68rem] uppercase tracking-[0.14em] text-navy/40">
                {catalog.length} SKUs
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

      {/* التغطية */}
      <section id="coverage" className="section relative overflow-hidden bg-navy text-white">
        <CoverageBackground />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.5rem))]">
          <div className="section-head max-w-xl">
            <h2 className="section-title section-title--on-dark">وين بتشتغل؟</h2>
            <p className="section-lead section-lead--on-dark">المناطق المنشورة للتوزيع حالياً.</p>
          </div>

          {coverageAreas.length ? (
            <div className="mt-10">
              <CoverageMap />
            </div>
          ) : (
            <p className="mt-8 text-white/70">{coverageInquiryCopy}</p>
          )}

          <div className="mt-10">
            <Button href="#contact">{coverageInquiryCopy}</Button>
          </div>
        </div>
      </section>

      <SectionWaveDivider from="navy" to="ice" />

      {/* عن شلاش */}
      <section id="about" className="section relative overflow-hidden bg-ice text-navy">
        <AboutBackground />
        <div className="relative z-10 mx-auto grid w-[min(1200px,calc(100%-2.5rem))] gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="section-head">
            <h2 className="section-title">عن شلاش</h2>
            <p className="section-lead">{company.aboutLead}</p>
            <div className="mt-5 grid gap-4">
              {company.aboutBody.map((p) => (
                <p key={p} className="m-0 leading-8 text-navy/70">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="font-en text-xs uppercase tracking-[0.16em] text-navy/50">نخدم</p>
            <ul className="mt-4 grid list-none gap-3 p-0">
              {company.serves.map((s) => (
                <li key={s} className="border-s-2 border-orange ps-3 text-lg">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SectionWaveDivider from="ice" to="white" />

      {/* تواصل */}
      <section id="contact" className="section relative overflow-hidden bg-white text-navy">
        <ContactBackground />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.5rem))]">
          <div className="section-head max-w-2xl">
            <p className="contact-cta__eyebrow">لأصحاب المحلات والشركاء</p>
            <h2 className="section-title">عندك محل؟ خلينا نوزّع عندك</h2>
            <p className="section-lead">
              استفسار توزيع أو زيارة مندوب — اختر الطريقة الأنسب. الموقع للتعريف والعرض فقط.
            </p>
            <p className="mt-3 text-sm text-navy/55">
              {contactSettings.hoursAr} · {contactSettings.addressAr}
            </p>
          </div>
          <div className="mt-9">
            <ContactCards />
          </div>
        </div>
      </section>

      <SectionWaveDivider from="white" to="navy" />
    </>
  );
}
