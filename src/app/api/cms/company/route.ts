import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireCmsApi } from "@/lib/cms/api";

function uniqStrings(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    const s = String(item).trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

export async function GET() {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const row = await prisma.companyContent.findUnique({ where: { id: "default" } });
  return jsonOk(row);
}

export async function PUT(req: Request) {
  const gate = await requireCmsApi();
  if (gate.error) return gate.error;
  const body = await req.json();
  const aboutBody = uniqStrings(body.aboutBody);
  const serves = uniqStrings(body.serves);
  const partnerNames = uniqStrings(body.partnerNames);
  const row = await prisma.companyContent.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      nameAr: String(body.nameAr ?? ""),
      nameEn: String(body.nameEn ?? ""),
      legalName: String(body.legalName ?? ""),
      roleAr: String(body.roleAr ?? ""),
      roleEn: String(body.roleEn ?? ""),
      intro: String(body.intro ?? ""),
      aboutLead: String(body.aboutLead ?? ""),
      aboutBody,
      serves,
      factsJson: body.factsJson ?? [],
      foundedYear: body.foundedYear == null || body.foundedYear === "" ? null : Number(body.foundedYear),
      clientCount: body.clientCount == null || body.clientCount === "" ? null : Number(body.clientCount),
      partnerNames,
    },
    update: {
      nameAr: String(body.nameAr ?? ""),
      nameEn: String(body.nameEn ?? ""),
      legalName: String(body.legalName ?? ""),
      roleAr: String(body.roleAr ?? ""),
      roleEn: String(body.roleEn ?? ""),
      intro: String(body.intro ?? ""),
      aboutLead: String(body.aboutLead ?? ""),
      aboutBody,
      serves,
      factsJson: body.factsJson ?? [],
      foundedYear: body.foundedYear == null || body.foundedYear === "" ? null : Number(body.foundedYear),
      clientCount: body.clientCount == null || body.clientCount === "" ? null : Number(body.clientCount),
      partnerNames,
    },
  });
  if (!row.nameAr) return jsonError("اسم الشركة مطلوب");
  return jsonOk(row);
}
