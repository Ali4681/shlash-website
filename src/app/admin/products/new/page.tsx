import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <AdminShell title="منتج جديد" subtitle="أضف صنفاً جديداً للكتالوج">
      <ProductForm mode="create" categories={categories} brands={brands} />
    </AdminShell>
  );
}
