import { prisma } from "@/lib/prisma";
import { jsonOk, requireCmsApi } from "@/lib/cms/api";

export async function GET() {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const [settings, channels, social] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.contactChannel.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return jsonOk({ settings, channels, social });
}

export async function PUT(req: Request) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const body = await req.json();

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      phone: String(body.phone ?? ""),
      email: String(body.email ?? ""),
      address: String(body.address ?? ""),
      hoursAr: String(body.hoursAr ?? ""),
      hoursEn: String(body.hoursEn ?? ""),
    },
    update: {
      phone: String(body.phone ?? ""),
      email: String(body.email ?? ""),
      address: String(body.address ?? ""),
      hoursAr: String(body.hoursAr ?? ""),
      hoursEn: String(body.hoursEn ?? ""),
    },
  });

  if (Array.isArray(body.channels)) {
    await prisma.contactChannel.deleteMany();
    await prisma.contactChannel.createMany({
      data: body.channels.map(
        (
          c: {
            id?: string;
            type: string;
            labelAr: string;
            value: string;
            href: string;
            enabled?: boolean;
          },
          i: number,
        ) => ({
          id: c.id || undefined,
          type: c.type,
          labelAr: c.labelAr,
          value: c.value,
          href: c.href,
          enabled: c.enabled !== false,
          sortOrder: i,
        }),
      ),
    });
  }

  if (Array.isArray(body.social)) {
    await prisma.socialLink.deleteMany();
    await prisma.socialLink.createMany({
      data: body.social.map(
        (
          s: {
            id?: string;
            labelAr: string;
            labelEn: string;
            href: string;
            enabled?: boolean;
          },
          i: number,
        ) => ({
          id: s.id || undefined,
          labelAr: s.labelAr,
          labelEn: s.labelEn,
          href: s.href,
          enabled: s.enabled !== false,
          sortOrder: i,
        }),
      ),
    });
  }

  const [channels, social] = await Promise.all([
    prisma.contactChannel.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return jsonOk({ settings, channels, social });
}
