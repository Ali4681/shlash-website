import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { units: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <AdminShell title="تعديل منتج" subtitle={product.nameAr}>
      <ProductForm
        mode="edit"
        productId={product.id}
        categories={categories}
        brands={brands}
        initial={{
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          slug: product.slug,
          descriptionAr: product.descriptionAr,
          categoryId: product.categoryId,
          brandId: product.brandId,
          weight: product.weight,
          accent: product.accent,
          featured: product.featured,
          available: product.available,
          flavors: product.flavors,
          image: product.image,
          units: product.units.map((u) => ({
            labelAr: u.labelAr,
            labelEn: u.labelEn,
            packCount: u.packCount,
            amount: u.amount,
            currency: u.currency,
          })),
        }}
      />
    </AdminShell>
  );
}
