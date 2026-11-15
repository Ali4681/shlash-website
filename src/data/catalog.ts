export type Money = { amount: number; currency: "SYP" | "USD" };

export type SellUnit = {
  id: string;
  labelAr: string;
  labelEn: string;
  /** How many base packs inside this unit (1 for single pack) */
  packCount: number;
  price: Money;
};

export type FlavorId = "chocolate" | "milk" | "strawberry" | "banana";

export type ProductFlavor = {
  id: FlavorId;
  nameAr: string;
  nameEn: string;
};

export const productFlavors: ProductFlavor[] = [
  { id: "chocolate", nameAr: "شوكولا", nameEn: "Chocolate" },
  { id: "milk", nameAr: "حليب", nameEn: "Milk" },
  { id: "strawberry", nameAr: "فريز", nameEn: "Strawberry" },
  { id: "banana", nameAr: "موز", nameEn: "Banana" },
];

export type Product = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  categoryId: string;
  brandId: string;
  weight?: string;
  image: string;
  featured?: boolean;
  units: SellUnit[];
  available: boolean;
  /** Optional flavor variants shown in the product detail modal */
  flavors?: FlavorId[];
  /** Card packaging accent (hex). Falls back to --blue when omitted. */
  accent?: string;
};

export type Category = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
};

export type Brand = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  supplierNote?: string;
};

export const categories: Category[] = [
  {
    id: "cat-biscuit",
    slug: "biscuits",
    nameAr: "بسكوت",
    nameEn: "Biscuits",
  },
];

export const brands: Brand[] = [
  {
    id: "brand-source-1",
    slug: "shlash-supply",
    nameAr: "تشكيلة التوريد",
    nameEn: "Supply Line",
    supplierNote: "مصدر توريد واحد حالياً — قابل لإضافة ماركات لاحقاً",
  },
];

/** Demo catalog — replace images/prices with approved backend contract */
export const products: Product[] = [
  {
    id: "p1",
    slug: "classic-butter-biscuit",
    nameAr: "بسكوت الزبدة الكلاسيكي",
    nameEn: "Classic Butter Biscuit",
    descriptionAr:
      "بسكوت زبدة مقرمش بطعم تقليدي، مناسب للبيع اليومي على رفوف المحلات.",
    categoryId: "cat-biscuit",
    brandId: "brand-source-1",
    weight: "200 غ",
    image: "/media/products/cutout/butter.png",
    accent: "#E8B423",
    featured: true,
    available: true,
    flavors: ["chocolate", "milk", "strawberry", "banana"],
    units: [
      { id: "u1", labelAr: "علبة", labelEn: "Pack", packCount: 1, price: { amount: 8500, currency: "SYP" } },
      { id: "u2", labelAr: "كرتونة (24 علبة)", labelEn: "Carton (24)", packCount: 24, price: { amount: 185000, currency: "SYP" } },
    ],
  },
  {
    id: "p2",
    slug: "chocolate-sandwich",
    nameAr: "بسكوت ساندويش شوكولا",
    nameEn: "Chocolate Sandwich",
    descriptionAr: "ساندويش محشو بكريمة شوكولا — صنف مطلوب في نقاط البيع.",
    categoryId: "cat-biscuit",
    brandId: "brand-source-1",
    weight: "36 غ × 12",
    image: "/media/products/cutout/choco.png",
    accent: "#4A2A1A",
    featured: true,
    available: true,
    flavors: ["chocolate", "milk", "strawberry", "banana"],
    units: [
      { id: "u1", labelAr: "علبة", labelEn: "Pack", packCount: 1, price: { amount: 12000, currency: "SYP" } },
      { id: "u2", labelAr: "كرتونة (20 علبة)", labelEn: "Carton (20)", packCount: 20, price: { amount: 220000, currency: "SYP" } },
    ],
  },
  {
    id: "p3",
    slug: "tea-time-digestive",
    nameAr: "بسكوت شاي دايجستف",
    nameEn: "Tea Time Digestive",
    descriptionAr: "بسكوت دايجستف خفيف مع الشاي — عبوة واضحة للعرض على الرف.",
    categoryId: "cat-biscuit",
    brandId: "brand-source-1",
    weight: "400 غ",
    image: "/media/products/cutout/digestive.png",
    accent: "#C9A06A",
    featured: true,
    available: true,
    flavors: ["chocolate", "milk", "strawberry", "banana"],
    units: [
      { id: "u1", labelAr: "علبة", labelEn: "Pack", packCount: 1, price: { amount: 15000, currency: "SYP" } },
      { id: "u2", labelAr: "كرتونة (12 علبة)", labelEn: "Carton (12)", packCount: 12, price: { amount: 165000, currency: "SYP" } },
    ],
  },
  {
    id: "p4",
    slug: "wafer-vanilla",
    nameAr: "ويفر فانيلا",
    nameEn: "Vanilla Wafer",
    descriptionAr: "ويفر طبقات بكريمة فانيلا — صنف سريع الحركة للتجزئة.",
    categoryId: "cat-biscuit",
    brandId: "brand-source-1",
    weight: "80 غ",
    image: "/media/products/cutout/wafer.png",
    accent: "#E8D5A3",
    featured: true,
    available: true,
    flavors: ["chocolate", "milk", "strawberry", "banana"],
    units: [
      { id: "u1", labelAr: "علبة", labelEn: "Pack", packCount: 1, price: { amount: 7000, currency: "SYP" } },
      { id: "u2", labelAr: "كرتونة (30 علبة)", labelEn: "Carton (30)", packCount: 30, price: { amount: 195000, currency: "SYP" } },
    ],
  },
  {
    id: "p5",
    slug: "kids-fun-rings",
    nameAr: "بسكوت حلقات للأطفال",
    nameEn: "Kids Fun Rings",
    descriptionAr: "حلقات ملونة بطعم لطيف — مناسب لعروض الأطفال في المحل.",
    categoryId: "cat-biscuit",
    brandId: "brand-source-1",
    weight: "150 غ",
    image: "/media/products/cutout/rings.png",
    accent: "#E85D4C",
    featured: false,
    available: true,
    flavors: ["chocolate", "milk", "strawberry", "banana"],
    units: [
      { id: "u1", labelAr: "علبة", labelEn: "Pack", packCount: 1, price: { amount: 9500, currency: "SYP" } },
      { id: "u2", labelAr: "كرتونة (18 علبة)", labelEn: "Carton (18)", packCount: 18, price: { amount: 155000, currency: "SYP" } },
    ],
  },
  {
    id: "p6",
    slug: "salted-cracker",
    nameAr: "كراكر مملح",
    nameEn: "Salted Cracker",
    descriptionAr: "كراكر مملح خفيف للوجبات السريعة والضيافة.",
    categoryId: "cat-biscuit",
    brandId: "brand-source-1",
    weight: "250 غ",
    image: "/media/products/cutout/cracker.png",
    accent: "#8B6B4A",
    featured: false,
    available: true,
    units: [
      { id: "u1", labelAr: "علبة", labelEn: "Pack", packCount: 1, price: { amount: 11000, currency: "SYP" } },
      { id: "u2", labelAr: "كرتونة (16 علبة)", labelEn: "Carton (16)", packCount: 16, price: { amount: 160000, currency: "SYP" } },
    ],
  },
];

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getBrand(id: string) {
  return brands.find((b) => b.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured && p.available);
}

/** Deterministic money format — Western digits (avoids Intl SSR/client mismatches). */
export function formatMoney(money: Money) {
  const formatted = Math.round(money.amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return money.currency === "SYP" ? `${formatted} ل.س` : `${formatted} $`;
}
