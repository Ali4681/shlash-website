import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireCmsApi } from "@/lib/cms/api";
import { saveUploadedImage } from "@/lib/cms/upload";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { units: { orderBy: { sortOrder: "asc" } }, category: true, brand: true },
  });
  if (!product) return jsonError("المنتج غير موجود", 404);
  return jsonOk(product);
}

export async function PUT(req: Request, ctx: Ctx) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  const form = await req.formData();
  const nameAr = String(form.get("nameAr") ?? "").trim();
  const nameEn = String(form.get("nameEn") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim();
  const descriptionAr = String(form.get("descriptionAr") ?? "").trim();
  const categoryId = String(form.get("categoryId") ?? "").trim();
  const brandId = String(form.get("brandId") ?? "").trim();
  const weight = String(form.get("weight") ?? "").trim() || null;
  const accent = String(form.get("accent") ?? "").trim() || null;
  const featured = form.get("featured") === "true" || form.get("featured") === "on";
  const available = form.get("available") !== "false" && form.get("available") !== "off";
  const flavorsRaw = String(form.get("flavors") ?? "");
  const flavors = flavorsRaw
    ? flavorsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const unitsRaw = String(form.get("units") ?? "[]");
  let units: {
    labelAr: string;
    labelEn: string;
    packCount: number;
    amount: number;
    currency: string;
  }[] = [];
  try {
    units = JSON.parse(unitsRaw);
  } catch {
    return jsonError("وحدات البيع غير صالحة");
  }

  if (!nameAr || !nameEn || !slug || !descriptionAr || !categoryId || !brandId) {
    return jsonError("أكمل الحقول المطلوبة");
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return jsonError("المنتج غير موجود", 404);

  let image = String(form.get("imagePath") ?? existing.image).trim() || existing.image;
  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      image = await saveUploadedImage(file);
    } catch (e) {
      return jsonError(e instanceof Error ? e.message : "فشل رفع الصورة");
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      nameAr,
      nameEn,
      slug,
      descriptionAr,
      categoryId,
      brandId,
      weight,
      accent,
      featured,
      available,
      flavors,
      image,
      units: {
        deleteMany: {},
        create: units.map((u, i) => ({
          labelAr: u.labelAr,
          labelEn: u.labelEn,
          packCount: Number(u.packCount) || 1,
          amount: Number(u.amount) || 0,
          currency: u.currency || "SYP",
          sortOrder: i,
        })),
      },
    },
    include: { units: true },
  });

  return jsonOk(product);
}

export async function DELETE(_: Request, ctx: Ctx) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  await prisma.product.delete({ where: { id } });
  return jsonOk({ ok: true });
}
