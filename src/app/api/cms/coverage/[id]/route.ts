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
  if (!nameAr || !nameEn) return jsonError("أكمل الاسم");
  const row = await prisma.coverageArea.update({
    where: { id },
    data: {
      nameAr,
      nameEn,
      status: String(body.status ?? "inquiry"),
      note: body.note ? String(body.note) : null,
      lat: body.lat === "" || body.lat == null ? null : Number(body.lat),
      lon: body.lon === "" || body.lon == null ? null : Number(body.lon),
      labelOffsetX:
        body.labelOffsetX === "" || body.labelOffsetX == null ? null : Number(body.labelOffsetX),
      labelOffsetY:
        body.labelOffsetY === "" || body.labelOffsetY == null ? null : Number(body.labelOffsetY),
    },
  });
  return jsonOk(row);
}

export async function DELETE(_: Request, ctx: Ctx) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  await prisma.coverageArea.delete({ where: { id } });
  return jsonOk({ ok: true });
}
