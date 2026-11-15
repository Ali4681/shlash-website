export type CoverageStatus = "active" | "limited" | "inquiry";

export type CoverageArea = {
  id: string;
  nameAr: string;
  nameEn: string;
  status: CoverageStatus;
  note?: string;
  /** WGS84 pin — omit when the area is drawn as a map polygon instead */
  lat?: number;
  lon?: number;
  /** Label offset in SVG px to avoid overlap (optional) */
  labelOffset?: { x: number; y: number };
};

/** Published coverage — pins need lat/lon; polygon regions omit them */
export const coverageAreas: CoverageArea[] = [
  {
    id: "c1",
    nameAr: "دمشق",
    nameEn: "Damascus",
    status: "active",
    note: "تغطية يومية لنقاط البيع",
    lat: 33.5138,
    lon: 36.2765,
    labelOffset: { x: -4, y: 18 },
  },
  {
    id: "c2",
    nameAr: "ريف دمشق",
    nameEn: "Damascus Countryside",
    status: "active",
    lat: 33.52,
    lon: 36.4,
    labelOffset: { x: 28, y: -12 },
  },
  {
    id: "c3",
    nameAr: "حلب",
    nameEn: "Aleppo",
    status: "limited",
    note: "تغطية محدودة — تواصل للتأكيد",
    lat: 36.2021,
    lon: 37.1343,
    labelOffset: { x: 0, y: -16 },
  },
  {
    id: "c4",
    nameAr: "حمص",
    nameEn: "Homs",
    status: "inquiry",
    lat: 34.7324,
    lon: 36.7137,
    labelOffset: { x: -22, y: -4 },
  },
];

export const coverageInquiryCopy =
  "تواصل معنا للاستفسار عن التوزيع بمنطقتك";

/** geoBoundaries shapeName → Arabic governorate name */
export const governorateNameAr: Record<string, string> = {
  Damascus: "دمشق",
  Aleppo: "حلب",
  "Rural Damascus": "ريف دمشق",
  Homs: "حمص",
  Hama: "حماة",
  Lattakia: "اللاذقية",
  Idleb: "إدلب",
  "Al-Hasakeh": "الحسكة",
  "Deir-ez-Zor": "دير الزور",
  Tartous: "طرطوس",
  "Ar-Raqqa": "الرقة",
  "Dar'a": "درعا",
  "As-Sweida": "السويداء",
  Quneitra: "القنيطرة",
  Alexandretta: "لواء إسكندرون",
  Hatay: "لواء إسكندرون",
};
