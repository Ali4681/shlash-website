import { ScrollHero } from "@/components/hero/ScrollHero";
import { HomeSections } from "@/components/home/HomeSections";
import {
  getCmsBrands,
  getCmsCategories,
  getCmsCompany,
  getCmsContact,
  getCmsCoverage,
  getCmsProducts,
  getCmsSite,
} from "@/lib/cms/content";
import { brands as fallbackBrands, categories as fallbackCategories, products as fallbackProducts } from "@/data/catalog";
import { company as fallbackCompany } from "@/data/company";
import { contactSettings as fallbackContact } from "@/data/contact";
import { coverageAreas as fallbackAreas, coverageInquiryCopy as fallbackInquiry } from "@/data/coverage";
import { site as fallbackSite } from "@/data/site";

export const instant = false;

export default async function HomePage() {
  const [products, categories, brands, company, contact, coverage, site] =
    await Promise.all([
      getCmsProducts(),
      getCmsCategories(),
      getCmsBrands(),
      getCmsCompany(),
      getCmsContact(),
      getCmsCoverage(),
      getCmsSite(),
    ]);

  return (
    <>
      <div id="top" />
      <ScrollHero site={site ?? fallbackSite} />
      <HomeSections
        products={products.length ? products : fallbackProducts}
        categories={categories.length ? categories : fallbackCategories}
        brands={brands.length ? brands : fallbackBrands}
        company={company ?? fallbackCompany}
        contact={contact ?? fallbackContact}
        coverageAreas={coverage.areas.length ? coverage.areas : fallbackAreas}
        coverageInquiryCopy={coverage.inquiryCopy || fallbackInquiry}
      />
    </>
  );
}
