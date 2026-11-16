import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireCmsApi } from "@/lib/cms/api";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  const body = await req.json();
  const nameAr = String(body.nameAr ?? "").trim();
  const nameEn = String(body.nameEn ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  if (!nameAr || !nameEn || !slug) return jsonError("أكمل الحقول");
  const row = await prisma.category.update({
    where: { id },
    data: { nameAr, nameEn, slug },
  });
  return jsonOk(row);
}

export async function DELETE(_: Request, ctx: Ctx) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  const used = await prisma.product.count({ where: { categoryId: id } });
  if (used > 0) return jsonError("لا يمكن حذف فئة مرتبطة بمنتجات");
  await prisma.category.delete({ where: { id } });
  return jsonOk({ ok: true });
}
