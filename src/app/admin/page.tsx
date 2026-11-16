import { AdminOverview } from "@/components/admin/AdminOverview";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function AdminHomePage() {
  const [products, categories, brands, coverage] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.coverageArea.count(),
  ]);

  return (
    <AdminOverview
      products={products}
      categories={categories}
      brands={brands}
      coverage={coverage}
    />
  );
}
