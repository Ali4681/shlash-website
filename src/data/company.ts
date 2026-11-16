export const company = {
  nameAr: "شلاش",
  nameEn: "SHLASH",
  legalName: "شركة شلاش للتوزيع",
  roleAr: "شركة توزيع منتجات",
  roleEn: "Product Distribution Company",
  intro:
    "شلاش شركة توزيع منتجات. نوزّع اليوم أصناف البسكوت على المحلات ونقاط البيع. من هون فيك تتعرّف على الشركة وتكتشف المنتجات اللي منوزّعها.",
  aboutLead:
    "شلاش شركة توزيع غذائي تركّز حالياً على أصناف البسكوت من مصدر توريد واحد، وتوصلها للمحلات والسوبرماركت ونقاط البيع.",
  aboutBody: [
    "نخدم أصحاب المحلات وتجار التجزئة عبر كتالوج واضح وطلبية أولية سهلة، مع مسار منفصل للتجار المسجّلين عبر تطبيق الويب.",
    "مع التوسّع يمكن إضافة موردين وماركات وفئات جديدة من البيانات نفسها دون إعادة بناء الموقع.",
  ],
  serves: ["أصحاب المحلات", "السوبرماركت", "المولات ونقاط البيع", "شركاء تجاريون"],
  facts: [
    {
      id: "activity",
      icon: "truck" as const,
      label: "النشاط",
      labelEn: "Activity",
      value: "توزيع منتجات",
      valueEn: "Product distribution",
    },
    {
      id: "category",
      icon: "biscuit" as const,
      label: "الفئة الحالية",
      labelEn: "Current category",
      value: "بسكوت",
      valueEn: "Biscuits",
    },
    {
      id: "supply",
      icon: "source" as const,
      label: "مصادر التوريد",
      labelEn: "Supply sources",
      value: "مصدر واحد حالياً",
      valueEn: "Single source for now",
    },
    {
      id: "audience",
      icon: "store" as const,
      label: "الجمهور",
      labelEn: "Audience",
      value: "محلات · تجزئة · شركاء",
      valueEn: "Shops · Retail · Partners",
    },
  ],
  /** Only approved facts — leave empty until confirmed by the company */
  foundedYear: null as number | null,
  clientCount: null as number | null,
  partnerNames: [] as string[],
};
