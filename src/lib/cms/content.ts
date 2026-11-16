import { prisma } from "@/lib/prisma";
import type { FlavorId, Money, Product, SellUnit } from "@/data/catalog";
import { productFlavors as flavorCatalog, products as fallbackProducts } from "@/data/catalog";
import { coverageAreas as fallbackCoverage } from "@/data/coverage";

export { flavorCatalog };

function mapProduct(p: {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  categoryId: string;
  brandId: string;
  weight: string | null;
  image: string;
  accent: string | null;
  featured: boolean;
  available: boolean;
  flavors: string[];
  units: {
    id: string;
    labelAr: string;
    labelEn: string;
    packCount: number;
    amount: number;
    currency: string;
  }[];
}): Product {
  const fallback = fallbackProducts.find((f) => f.slug === p.slug);
  return {
    id: p.id,
    slug: p.slug,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    descriptionAr: p.descriptionAr,
    descriptionEn: fallback?.descriptionEn,
    categoryId: p.categoryId,
    brandId: p.brandId,
    weight: p.weight ?? undefined,
    image: p.image,
    accent: p.accent ?? undefined,
    featured: p.featured,
    available: p.available,
    flavors: p.flavors as FlavorId[],
    units: p.units.map(
      (u): SellUnit => ({
        id: u.id,
        labelAr: u.labelAr,
        labelEn: u.labelEn,
        packCount: u.packCount,
        price: { amount: u.amount, currency: u.currency as Money["currency"] },
      }),
    ),
  };
}

export async function getCmsProducts() {
  try {
    const rows = await prisma.product.findMany({
      include: { units: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getCmsCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameAr: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getCmsBrands() {
  try {
    return await prisma.brand.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameAr: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getCmsCompany() {
  try {
    const row = await prisma.companyContent.findUnique({ where: { id: "default" } });
    if (!row) return null;
    return {
      nameAr: row.nameAr,
      nameEn: row.nameEn,
      legalName: row.legalName,
      roleAr: row.roleAr,
      roleEn: row.roleEn,
      intro: row.intro,
      aboutLead: row.aboutLead,
      aboutBody: row.aboutBody,
      serves: row.serves,
      facts: (row.factsJson as {
        id: string;
        icon: "truck" | "biscuit" | "source" | "store";
        label: string;
        labelEn?: string;
        value: string;
        valueEn?: string;
      }[]).map((f) => ({
        ...f,
        labelEn: f.labelEn,
        valueEn: f.valueEn,
      })),
      foundedYear: row.foundedYear,
      clientCount: row.clientCount,
      partnerNames: row.partnerNames,
    };
  } catch {
    return null;
  }
}

export async function getCmsSite() {
  try {
    const [settings, company] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
      getCmsCompany(),
    ]);
    if (!settings || !company) return null;
    return {
      nameAr: company.nameAr,
      nameEn: company.nameEn,
      roleAr: company.roleAr,
      roleEn: company.roleEn,
      taglineAr: company.intro,
      taglineEn: company.roleEn,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
    };
  } catch {
    return null;
  }
}

export async function getCmsNav() {
  try {
    return await prisma.navItem.findMany({
      where: { enabled: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getCmsContact() {
  try {
    const [settings, channels, social] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
      prisma.contactChannel.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    if (!settings) return null;
    return {
      hoursAr: settings.hoursAr,
      hoursEn: settings.hoursEn,
      addressAr: settings.address,
      addressEn:
        /دمشق/.test(settings.address) ? "Damascus · Syria" : undefined,
      channels: channels.map((c) => {
        const type = c.type as "whatsapp" | "phone" | "email";
        const labelEn =
          type === "whatsapp" ? "WhatsApp" : type === "phone" ? "Phone" : "Email";
        return {
          id: c.id,
          type,
          labelAr: c.labelAr,
          labelEn,
          value: c.value,
          href: c.href,
          enabled: c.enabled,
        };
      }),
      social: social.map((s) => ({
        id: s.id,
        labelAr: s.labelAr,
        labelEn: s.labelEn,
        href: s.href,
        enabled: s.enabled,
      })),
    };
  } catch {
    return null;
  }
}

export async function getCmsCoverage() {
  try {
    const [areas, settings] = await Promise.all([
      prisma.coverageArea.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.coverageSettings.findUnique({ where: { id: "default" } }),
    ]);
    return {
      areas: areas.map((a) => {
        const fallback = fallbackCoverage.find(
          (f) => f.nameEn === a.nameEn || f.nameAr === a.nameAr,
        );
        return {
          id: a.id,
          nameAr: a.nameAr,
          nameEn: a.nameEn,
          status: a.status as "active" | "limited" | "inquiry",
          note: a.note ?? undefined,
          noteEn: fallback?.noteEn,
          lat: a.lat ?? undefined,
          lon: a.lon ?? undefined,
          labelOffset:
            a.labelOffsetX != null || a.labelOffsetY != null
              ? { x: a.labelOffsetX ?? 0, y: a.labelOffsetY ?? 0 }
              : undefined,
        };
      }),
      inquiryCopy: settings?.inquiryCopy ?? "تواصل معنا للاستفسار عن التوزيع بمنطقتك",
    };
  } catch {
    return { areas: [], inquiryCopy: "تواصل معنا للاستفسار عن التوزيع بمنطقتك" };
  }
}

export function getCategoryFromList(
  categories: Awaited<ReturnType<typeof getCmsCategories>>,
  id: string,
) {
  return categories.find((c) => c.id === id);
}

export function getBrandFromList(brands: Awaited<ReturnType<typeof getCmsBrands>>, id: string) {
  return brands.find((b) => b.id === id);
}

export { flavorCatalog as productFlavors };
