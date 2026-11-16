import { PrismaClient } from "@prisma/client";
import { brands, categories, products } from "../src/data/catalog";
import { company } from "../src/data/company";
import { contactSettings } from "../src/data/contact";
import { coverageAreas, coverageInquiryCopy } from "../src/data/coverage";
import { nav, site } from "../src/data/site";

const prisma = new PrismaClient();

async function main() {
  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        slug: c.slug,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        sortOrder: i,
      },
      update: {
        slug: c.slug,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        sortOrder: i,
      },
    });
  }

  for (const [i, b] of brands.entries()) {
    await prisma.brand.upsert({
      where: { id: b.id },
      create: {
        id: b.id,
        slug: b.slug,
        nameAr: b.nameAr,
        nameEn: b.nameEn,
        supplierNote: b.supplierNote,
        sortOrder: i,
      },
      update: {
        slug: b.slug,
        nameAr: b.nameAr,
        nameEn: b.nameEn,
        supplierNote: b.supplierNote,
        sortOrder: i,
      },
    });
  }

  for (const [i, p] of products.entries()) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        slug: p.slug,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        descriptionAr: p.descriptionAr,
        categoryId: p.categoryId,
        brandId: p.brandId,
        weight: p.weight,
        image: p.image,
        accent: p.accent,
        featured: Boolean(p.featured),
        available: p.available,
        flavors: p.flavors ?? [],
        sortOrder: i,
        units: {
          create: p.units.map((u, ui) => ({
            id: `${p.id}-${u.id}`,
            labelAr: u.labelAr,
            labelEn: u.labelEn,
            packCount: u.packCount,
            amount: u.price.amount,
            currency: u.price.currency,
            sortOrder: ui,
          })),
        },
      },
      update: {
        slug: p.slug,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        descriptionAr: p.descriptionAr,
        categoryId: p.categoryId,
        brandId: p.brandId,
        weight: p.weight,
        image: p.image,
        accent: p.accent,
        featured: Boolean(p.featured),
        available: p.available,
        flavors: p.flavors ?? [],
        sortOrder: i,
        units: {
          deleteMany: {},
          create: p.units.map((u, ui) => ({
            id: `${p.id}-${u.id}`,
            labelAr: u.labelAr,
            labelEn: u.labelEn,
            packCount: u.packCount,
            amount: u.price.amount,
            currency: u.price.currency,
            sortOrder: ui,
          })),
        },
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      phone: site.phone,
      email: site.email,
      address: site.address,
      hoursAr: contactSettings.hoursAr,
      hoursEn: contactSettings.hoursEn,
    },
    update: {
      phone: site.phone,
      email: site.email,
      address: site.address,
      hoursAr: contactSettings.hoursAr,
      hoursEn: contactSettings.hoursEn,
    },
  });

  await prisma.companyContent.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      nameAr: company.nameAr,
      nameEn: company.nameEn,
      legalName: company.legalName,
      roleAr: company.roleAr,
      roleEn: company.roleEn,
      intro: company.intro,
      aboutLead: company.aboutLead,
      aboutBody: company.aboutBody,
      serves: company.serves,
      factsJson: company.facts,
      foundedYear: company.foundedYear,
      clientCount: company.clientCount,
      partnerNames: company.partnerNames,
    },
    update: {
      nameAr: company.nameAr,
      nameEn: company.nameEn,
      legalName: company.legalName,
      roleAr: company.roleAr,
      roleEn: company.roleEn,
      intro: company.intro,
      aboutLead: company.aboutLead,
      aboutBody: company.aboutBody,
      serves: company.serves,
      factsJson: company.facts,
      foundedYear: company.foundedYear,
      clientCount: company.clientCount,
      partnerNames: company.partnerNames,
    },
  });

  await prisma.coverageSettings.upsert({
    where: { id: "default" },
    create: { id: "default", inquiryCopy: coverageInquiryCopy },
    update: { inquiryCopy: coverageInquiryCopy },
  });

  for (const [i, a] of coverageAreas.entries()) {
    await prisma.coverageArea.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        nameAr: a.nameAr,
        nameEn: a.nameEn,
        status: a.status,
        note: a.note,
        lat: a.lat,
        lon: a.lon,
        labelOffsetX: a.labelOffset?.x,
        labelOffsetY: a.labelOffset?.y,
        sortOrder: i,
      },
      update: {
        nameAr: a.nameAr,
        nameEn: a.nameEn,
        status: a.status,
        note: a.note,
        lat: a.lat,
        lon: a.lon,
        labelOffsetX: a.labelOffset?.x,
        labelOffsetY: a.labelOffset?.y,
        sortOrder: i,
      },
    });
  }

  await prisma.navItem.deleteMany();
  for (const [i, item] of nav.entries()) {
    await prisma.navItem.create({
      data: {
        href: item.href,
        label: item.label,
        sortOrder: i,
        enabled: true,
      },
    });
  }

  await prisma.contactChannel.deleteMany();
  for (const [i, ch] of contactSettings.channels.entries()) {
    await prisma.contactChannel.create({
      data: {
        id: ch.id,
        type: ch.type,
        labelAr: ch.labelAr,
        value: ch.value,
        href: ch.href,
        enabled: ch.enabled,
        sortOrder: i,
      },
    });
  }

  await prisma.socialLink.deleteMany();
  for (const [i, s] of contactSettings.social.entries()) {
    await prisma.socialLink.create({
      data: {
        id: s.id,
        labelAr: s.labelAr,
        labelEn: s.labelEn,
        href: s.href,
        enabled: s.enabled,
        sortOrder: i,
      },
    });
  }

  console.log("CMS seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
