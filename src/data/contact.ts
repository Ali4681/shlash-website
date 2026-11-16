export type ContactChannel = {
  id: string;
  type: "whatsapp" | "phone" | "email";
  labelAr: string;
  labelEn?: string;
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
  addressEn: "Damascus · Syria",
  channels: [
    {
      id: "wa",
      type: "whatsapp" as const,
      labelAr: "واتساب",
      labelEn: "WhatsApp",
      value: "+963 911111111",
      href: "https://wa.me/963911111111",
      enabled: true,
    },
    {
      id: "phone",
      type: "phone" as const,
      labelAr: "هاتف",
      labelEn: "Phone",
      value: "+963 911111111",
      href: "tel:+963911111111",
      enabled: true,
    },
    {
      id: "email",
      type: "email" as const,
      labelAr: "البريد",
      labelEn: "Email",
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
  { id: "general", labelAr: "استفسار عام", labelEn: "General inquiry" },
  { id: "product", labelAr: "استفسار عن منتج", labelEn: "Product inquiry" },
  { id: "visit", labelAr: "طلب زيارة لمحل", labelEn: "Request a store visit" },
  { id: "business", labelAr: "تواصل تجاري مع الشركة", labelEn: "Business contact" },
] as const;

export type ContactPurposeId = (typeof contactPurposes)[number]["id"];
