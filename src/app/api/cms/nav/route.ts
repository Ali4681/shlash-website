import { prisma } from "@/lib/prisma";
import { jsonOk, requireCmsApi } from "@/lib/cms/api";

export async function GET() {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  return jsonOk(await prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function PUT(req: Request) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const body = await req.json();
  const items = Array.isArray(body.items) ? body.items : [];
  await prisma.navItem.deleteMany();
  await prisma.navItem.createMany({
    data: items.map(
      (
        item: { href: string; label: string; enabled?: boolean },
        i: number,
      ) => ({
        href: String(item.href),
        label: String(item.label),
        enabled: item.enabled !== false,
        sortOrder: i,
      }),
    ),
  });
  return jsonOk(await prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } }));
}
