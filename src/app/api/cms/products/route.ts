import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireCmsApi } from "@/lib/cms/api";
import { saveUploadedImage } from "@/lib/cms/upload";

export async function GET() {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const products = await prisma.product.findMany({
    include: { units: { orderBy: { sortOrder: "asc" } }, category: true, brand: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return jsonOk(products);
}

export async function POST(req: Request) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;

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

  const file = form.get("image");
  let image = String(form.get("imagePath") ?? "").trim();
  if (file instanceof File && file.size > 0) {
    try {
      image = await saveUploadedImage(file);
    } catch (e) {
      return jsonError(e instanceof Error ? e.message : "فشل رفع الصورة");
    }
  }
  if (!image) return jsonError("أضف صورة للمنتج");

  const count = await prisma.product.count();
  const product = await prisma.product.create({
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
      sortOrder: count,
      units: {
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

  return jsonOk(product, { status: 201 });
}
