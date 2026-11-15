export type ContactChannel = {
  id: string;
  type: "whatsapp" | "phone" | "email";
  labelAr: string;
  value: string;
  href: string;
  enabled: boolean;
};

export type SocialLink = {
  id: string;
  labelAr: string;
  labelEn: string;
  href: string;
  enabled: boolean;
};

export const contactSettings = {
  hoursAr: "السبت — الخميس · 9:00 صباحاً إلى 6:00 مساءً",
  hoursEn: "Sat–Thu · 9:00–18:00",
  addressAr: "دمشق · سوريا",
  channels: [
    {
      id: "wa",
      type: "whatsapp" as const,
      labelAr: "واتساب",
      value: "+963 900 000 000",
      href: "https://wa.me/963900000000",
      enabled: true,
    },
    {
      id: "phone",
      type: "phone" as const,
      labelAr: "هاتف",
      value: "+963 11 000 0000",
      href: "tel:+963110000000",
      enabled: true,
    },
    {
      id: "email",
      type: "email" as const,
      labelAr: "البريد",
      value: "hello@shlash.com",
      href: "mailto:hello@shlash.com",
      enabled: true,
    },
  ] satisfies ContactChannel[],
  /** Enable when official handles are confirmed */
  social: [
    {
      id: "instagram",
      labelAr: "إنستغرام",
      labelEn: "Instagram",
      href: "https://instagram.com/shlash",
      enabled: true,
    },
    {
      id: "facebook",
      labelAr: "فيسبوك",
      labelEn: "Facebook",
      href: "https://facebook.com/shlash",
      enabled: true,
    },
  ] satisfies SocialLink[],
};

export const contactPurposes = [
  { id: "general", labelAr: "استفسار عام" },
  { id: "product", labelAr: "استفسار عن منتج" },
  { id: "visit", labelAr: "طلب زيارة لمحل" },
  { id: "business", labelAr: "تواصل تجاري مع الشركة" },
] as const;

export type ContactPurposeId = (typeof contactPurposes)[number]["id"];
