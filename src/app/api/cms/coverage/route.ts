import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireCmsApi } from "@/lib/cms/api";

export async function GET() {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const [areas, settings] = await Promise.all([
    prisma.coverageArea.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.coverageSettings.findUnique({ where: { id: "default" } }),
  ]);
  return jsonOk({ areas, settings });
}

export async function POST(req: Request) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const body = await req.json();
  const nameAr = String(body.nameAr ?? "").trim();
  const nameEn = String(body.nameEn ?? "").trim();
  const status = String(body.status ?? "inquiry");
  if (!nameAr || !nameEn) return jsonError("أكمل الاسم");
  const count = await prisma.coverageArea.count();
  const row = await prisma.coverageArea.create({
    data: {
      nameAr,
      nameEn,
      status,
      note: body.note ? String(body.note) : null,
      lat: body.lat === "" || body.lat == null ? null : Number(body.lat),
      lon: body.lon === "" || body.lon == null ? null : Number(body.lon),
      labelOffsetX:
        body.labelOffsetX === "" || body.labelOffsetX == null ? null : Number(body.labelOffsetX),
      labelOffsetY:
        body.labelOffsetY === "" || body.labelOffsetY == null ? null : Number(body.labelOffsetY),
      sortOrder: count,
    },
  });
  return jsonOk(row, { status: 201 });
}

export async function PUT(req: Request) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const body = await req.json();
  if (body.inquiryCopy != null) {
    await prisma.coverageSettings.upsert({
      where: { id: "default" },
      create: { id: "default", inquiryCopy: String(body.inquiryCopy) },
      update: { inquiryCopy: String(body.inquiryCopy) },
    });
  }
  return jsonOk({ ok: true });
}
