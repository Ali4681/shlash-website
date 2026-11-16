import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireCmsApi } from "@/lib/cms/api";

export async function GET() {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  return jsonOk(await prisma.category.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(req: Request) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const body = await req.json();
  const nameAr = String(body.nameAr ?? "").trim();
  const nameEn = String(body.nameEn ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  if (!nameAr || !nameEn || !slug) return jsonError("أكمل الحقول");
  const count = await prisma.category.count();
  const row = await prisma.category.create({
    data: { nameAr, nameEn, slug, sortOrder: count },
  });
  return jsonOk(row, { status: 201 });
}
