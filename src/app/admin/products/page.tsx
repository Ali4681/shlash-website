import { AdminProductsClient } from "@/components/admin/AdminProductsClient";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, brand: true, units: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <AdminProductsClient
      products={products.map((p) => ({
        id: p.id,
        slug: p.slug,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        image: p.image,
        available: p.available,
        category: { nameAr: p.category.nameAr, nameEn: p.category.nameEn },
        units: p.units.map((u) => ({ amount: u.amount, currency: u.currency })),
      }))}
    />
  );
}
