import type { Locale } from "@/lib/prefs";

export type Dictionary = {
  brand: {
    control: string;
    cms: string;
    cmsSub: string;
  };
  nav: Record<string, string>;
  header: {
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    whatsapp: string;
    hours: string;
  };
  hero: {
    aria: string;
    alt: string;
    line: string;
    discover: string;
    contact: string;
  };
  who: {
    title: string;
    aboutCta: string;
    productsCta: string;
  };
  products: {
    title: string;
    lead: string;
    shelf: string;
    skuCount: string;
  };
  coverage: {
    title: string;
    lead: string;
    mapAria: string;
    statusActive: string;
    statusLimited: string;
    statusInquiry: string;
    inquiry: string;
  };
  about: {
    title: string;
    serves: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  contactCards: {
    whatsappTitle: string;
    whatsappAction: string;
    phoneTitle: string;
    phoneAction: string;
    emailTitle: string;
    emailAction: string;
  };
  catalog: {
    featured: string;
    tapHint: string;
    close: string;
    available: string;
    unavailable: string;
    availableLong: string;
    unavailableLong: string;
    flavors: string;
    pickFlavor: string;
    flavorNote: string;
    sellUnits: string;
    inquire: string;
    currencySyp: string;
    currencyUsd: string;
  };
  a11y: {
    scrollRail: string;
  };
  content: {
    intro: string;
    aboutLead: string;
    aboutBody: string[];
    serves: string[];
    facts: Record<string, { label: string; value: string }>;
  };
  contactForm: {
    messageEyebrow: string;
    name: string;
    reply: string;
    shop: string;
    area: string;
    message: string;
    send: string;
    sending: string;
    done: string;
    error: string;
    purposes: Record<string, string>;
  };
  footer: {
    explore: string;
    contact: string;
    social: string;
  };
  theme: {
    light: string;
    dark: string;
    toggle: string;
  };
  locale: {
    ar: string;
    en: string;
    toggle: string;
  };
  admin: {
    overview: string;
    overviewSub: string;
    products: string;
    productsSub: string;
    categories: string;
    brands: string;
    company: string;
    contact: string;
    coverage: string;
    nav: string;
    loginTitle: string;
    loginLead: string;
    username: string;
    password: string;
    login: string;
    loggingIn: string;
    logout: string;
    openSite: string;
    live: string;
    adminUser: string;
    session: string;
    shortcuts: string;
    shortcutsSub: string;
    addProduct: string;
    addProductHint: string;
    companyHint: string;
    contactHint: string;
    newProduct: string;
    edit: string;
    delete: string;
    available: string;
    unavailable: string;
    save: string;
    saving: string;
    back: string;
    catalog: string;
    siteSection: string;
    dashboard: string;
    collapseSidebar: string;
    expandSidebar: string;
    searchPlaceholder: string;
    searchPages: string;
    searchProducts: string;
    searchEmpty: string;
    accountMenu: string;
  };
};

const ar: Dictionary = {
  brand: {
    control: "Shlash Control",
    cms: "شلاش CMS",
    cmsSub: "إدارة محتوى الموقع",
  },
  nav: {
    "#top": "شلاش",
    "#products": "المنتجات",
    "#coverage": "التغطية",
    "#about": "عنّا",
    "#contact": "تواصل",
    "#who": "مين شلاش",
  },
  header: {
    mainNav: "التنقل الرئيسي",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    whatsapp: "واتساب",
    hours: "ساعات العمل",
  },
  hero: {
    aria: "هوية شلاش",
    alt: "شلاش — توزيع منتجات مع الأسطول والشخصية",
    line: "من المستودع إلى المحل — توزيع يومي بثقة.",
    discover: "اكتشف المنتجات",
    contact: "تواصل معنا",
  },
  who: {
    title: "مين شلاش؟",
    aboutCta: "تعرّف على شلاش",
    productsCta: "اكتشف منتجاتنا",
  },
  products: {
    title: "شو بتوزّع اليوم؟",
    lead: "أصناف البسكوت من مصدر توريد واحد حالياً. شلاش هي الموزّع — والمنتجات معروضة كما على الرف.",
    shelf: "رف البسكوت",
    skuCount: "{n} صنف",
  },
  coverage: {
    title: "وين بتشتغل؟",
    lead: "المناطق المنشورة للتوزيع حالياً.",
    mapAria: "خريطة تغطية شلاش في سوريا",
    statusActive: "تغطية يومية",
    statusLimited: "تغطية محدودة",
    statusInquiry: "للاستفسار",
    inquiry: "تواصل معنا للاستفسار عن التوزيع بمنطقتك",
  },
  about: {
    title: "عن شلاش",
    serves: "نخدم",
  },
  contact: {
    eyebrow: "لأصحاب المحلات والشركاء",
    title: "عندك محل؟ خلينا نوزّع عندك",
    lead: "استفسار توزيع أو زيارة مندوب — اختر الطريقة الأنسب. الموقع للتعريف والعرض فقط.",
  },
  contactCards: {
    whatsappTitle: "واتساب",
    whatsappAction: "راسلنا مباشرة",
    phoneTitle: "اتصال",
    phoneAction: "اتصل بنا الآن",
    emailTitle: "البريد",
    emailAction: "أرسل إيميل",
  },
  catalog: {
    featured: "مميّز",
    tapHint: "اضغط لعرض التفاصيل",
    close: "إغلاق",
    available: "متوفر",
    unavailable: "غير متوفر",
    availableLong: "متوفر للتوزيع",
    unavailableLong: "غير متوفر حالياً",
    flavors: "النكهات",
    pickFlavor: "اختيار النكهة",
    flavorNote: "خلفية حقيقية لنكهة {name}",
    sellUnits: "وحدات البيع",
    inquire: "استفسر عن هذا الصنف",
    currencySyp: "ل.س",
    currencyUsd: "$",
  },
  a11y: {
    scrollRail: "شريط التمرير",
  },
  content: {
    intro:
      "شلاش شركة توزيع منتجات. نوزّع اليوم أصناف البسكوت على المحلات ونقاط البيع. من هون فيك تتعرّف على الشركة وتكتشف المنتجات اللي منوزّعها.",
    aboutLead:
      "شلاش شركة توزيع غذائي تركّز حالياً على أصناف البسكوت من مصدر توريد واحد، وتوصلها للمحلات والسوبرماركت ونقاط البيع.",
    aboutBody: [
      "نخدم أصحاب المحلات وتجار التجزئة عبر كتالوج واضح وطلبية أولية سهلة، مع مسار منفصل للتجار المسجّلين عبر تطبيق الويب.",
      "مع التوسّع يمكن إضافة موردين وماركات وفئات جديدة من البيانات نفسها دون إعادة بناء الموقع.",
    ],
    serves: ["أصحاب المحلات", "السوبرماركت", "المولات ونقاط البيع", "شركاء تجاريون"],
    facts: {
      activity: { label: "النشاط", value: "توزيع منتجات" },
      category: { label: "الفئة الحالية", value: "بسكوت" },
      supply: { label: "مصادر التوريد", value: "مصدر واحد حالياً" },
      audience: { label: "الجمهور", value: "محلات · تجزئة · شركاء" },
    },
  },
  contactForm: {
    messageEyebrow: "رسالة",
    name: "الاسم",
    reply: "وسيلة الرد",
    shop: "اسم المحل",
    area: "المنطقة",
    message: "الرسالة",
    send: "إرسال",
    sending: "جارٍ الإرسال…",
    done: "تم استلام رسالتك. سنتواصل معك قريباً.",
    error: "فشل الإرسال — حاول مجدداً.",
    purposes: {
      general: "استفسار عام",
      product: "استفسار عن منتج",
      visit: "طلب زيارة لمحل",
      business: "تواصل تجاري مع الشركة",
    },
  },
  footer: {
    explore: "استكشف",
    contact: "تواصل",
    social: "سوشيال",
  },
  theme: {
    light: "فاتح",
    dark: "داكن",
    toggle: "تبديل المظهر",
  },
  locale: {
    ar: "عربي",
    en: "English",
    toggle: "تبديل اللغة",
  },
  admin: {
    overview: "نظرة عامة",
    overviewSub: "ملخص حي لمحتوى الموقع — أدر الكتالوج والهوية من مكان واحد.",
    products: "المنتجات",
    productsSub: "كتالوج حي — أضف وعدّل الأصناف مع رفع الصورة من داخل الفورم.",
    categories: "الفئات",
    brands: "الماركات",
    company: "الشركة",
    contact: "التواصل",
    coverage: "التغطية",
    nav: "التنقل",
    loginTitle: "دخول لوحة الإدارة",
    loginLead: "مساحة واحدة لإدارة محتوى موقع شلاش — منتجات، شركة، تواصل، وتغطية.",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    login: "دخول إلى اللوحة",
    loggingIn: "جاري الدخول...",
    logout: "تسجيل الخروج",
    openSite: "فتح الموقع",
    live: "Live",
    adminUser: "المسؤول",
    session: "جلسة آمنة · CMS",
    shortcuts: "اختصارات سريعة",
    shortcutsSub: "انتقل مباشرة لأكثر المهام تكراراً",
    addProduct: "إضافة منتج",
    addProductHint: "أنشئ صنفاً جديداً مع صورة ووحدات بيع من الفورم مباشرة.",
    companyHint: "عدّل المقدمة والحقائق وقائمة «نخدم» الظاهرة على الموقع.",
    contactHint: "فعّل واتساب والهاتف والبريد والسوشيال من لوحة واحدة.",
    newProduct: "منتج جديد",
    edit: "تعديل",
    delete: "حذف",
    available: "متوفر",
    unavailable: "غير متوفر",
    save: "حفظ",
    saving: "جاري الحفظ...",
    back: "رجوع",
    catalog: "الكتالوج",
    siteSection: "الموقع",
    dashboard: "لوحة التحكم",
    collapseSidebar: "طي القائمة",
    expandSidebar: "فتح القائمة",
    searchPlaceholder: "ابحث في الصفحات والمنتجات…",
    searchPages: "الصفحات",
    searchProducts: "المنتجات",
    searchEmpty: "لا نتائج مطابقة",
    accountMenu: "قائمة الحساب",
  },
};

const en: Dictionary = {
  brand: {
    control: "Shlash Control",
    cms: "Shlash CMS",
    cmsSub: "Website content control",
  },
  nav: {
    "#top": "Shlash",
    "#products": "Products",
    "#coverage": "Coverage",
    "#about": "About",
    "#contact": "Contact",
    "#who": "Who we are",
  },
  header: {
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    whatsapp: "WhatsApp",
    hours: "Business hours",
  },
  hero: {
    aria: "Shlash identity",
    alt: "Shlash — product distribution with fleet and character",
    line: "From warehouse to store — daily distribution you can trust.",
    discover: "Discover products",
    contact: "Contact us",
  },
  who: {
    title: "Who is Shlash?",
    aboutCta: "Learn about Shlash",
    productsCta: "Explore products",
  },
  products: {
    title: "What do we distribute today?",
    lead: "Biscuit SKUs from a single supply source for now. Shlash is the distributor — products shown as on the shelf.",
    shelf: "Biscuit shelf",
    skuCount: "{n} SKUs",
  },
  coverage: {
    title: "Where do we operate?",
    lead: "Published distribution areas right now.",
    mapAria: "Shlash coverage map in Syria",
    statusActive: "Daily coverage",
    statusLimited: "Limited coverage",
    statusInquiry: "By inquiry",
    inquiry: "Contact us to ask about distribution in your area",
  },
  about: {
    title: "About Shlash",
    serves: "We serve",
  },
  contact: {
    eyebrow: "For shop owners & partners",
    title: "Got a store? Let’s distribute to you",
    lead: "Distribution inquiry or a rep visit — pick what works. This site is for introduction and display only.",
  },
  contactCards: {
    whatsappTitle: "WhatsApp",
    whatsappAction: "Message us directly",
    phoneTitle: "Call",
    phoneAction: "Call us now",
    emailTitle: "Email",
    emailAction: "Send an email",
  },
  catalog: {
    featured: "Featured",
    tapHint: "Tap for details",
    close: "Close",
    available: "Available",
    unavailable: "Unavailable",
    availableLong: "Available for distribution",
    unavailableLong: "Currently unavailable",
    flavors: "Flavors",
    pickFlavor: "Choose flavor",
    flavorNote: "Real backdrop for {name}",
    sellUnits: "Sell units",
    inquire: "Ask about this product",
    currencySyp: "SYP",
    currencyUsd: "$",
  },
  a11y: {
    scrollRail: "Page scrollbar",
  },
  content: {
    intro:
      "Shlash is a product distribution company. Today we distribute biscuit SKUs to shops and points of sale. Here you can learn about the company and explore what we distribute.",
    aboutLead:
      "Shlash is a food distribution company focused on biscuit SKUs from a single supply source, delivering them to shops, supermarkets, and points of sale.",
    aboutBody: [
      "We serve shop owners and retailers through a clear catalog and simple first order, with a separate path for registered traders via the web app.",
      "As we grow, new suppliers, brands, and categories can be added from the same data model without rebuilding the website.",
    ],
    serves: ["Shop owners", "Supermarkets", "Malls & points of sale", "Business partners"],
    facts: {
      activity: { label: "Activity", value: "Product distribution" },
      category: { label: "Current category", value: "Biscuits" },
      supply: { label: "Supply sources", value: "Single source for now" },
      audience: { label: "Audience", value: "Shops · Retail · Partners" },
    },
  },
  contactForm: {
    messageEyebrow: "Message",
    name: "Name",
    reply: "Reply channel",
    shop: "Shop name",
    area: "Area",
    message: "Message",
    send: "Send",
    sending: "Sending…",
    done: "Message received. We’ll get back to you soon.",
    error: "Send failed — please try again.",
    purposes: {
      general: "General inquiry",
      product: "Product inquiry",
      visit: "Request a store visit",
      business: "Business contact",
    },
  },
  footer: {
    explore: "Explore",
    contact: "Contact",
    social: "Social",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    toggle: "Toggle theme",
  },
  locale: {
    ar: "عربي",
    en: "English",
    toggle: "Switch language",
  },
  admin: {
    overview: "Overview",
    overviewSub: "Live snapshot of site content — manage catalog and brand in one place.",
    products: "Products",
    productsSub: "Live catalog — add and edit SKUs with inline image upload.",
    categories: "Categories",
    brands: "Brands",
    company: "Company",
    contact: "Contact",
    coverage: "Coverage",
    nav: "Navigation",
    loginTitle: "Admin sign in",
    loginLead: "One surface to manage Shlash website content — products, company, contact, and coverage.",
    username: "Username",
    password: "Password",
    login: "Enter dashboard",
    loggingIn: "Signing in…",
    logout: "Sign out",
    openSite: "Open website",
    live: "Live",
    adminUser: "Administrator",
    session: "Secure session · CMS",
    shortcuts: "Quick shortcuts",
    shortcutsSub: "Jump straight into the most common tasks",
    addProduct: "Add product",
    addProductHint: "Create a new SKU with image and sell units from the form.",
    companyHint: "Edit intro, facts, and the “we serve” list shown on the site.",
    contactHint: "Enable WhatsApp, phone, email, and social from one panel.",
    newProduct: "New product",
    edit: "Edit",
    delete: "Delete",
    available: "Available",
    unavailable: "Unavailable",
    save: "Save",
    saving: "Saving…",
    back: "Back",
    catalog: "Catalog",
    siteSection: "Website",
    dashboard: "Dashboard",
    collapseSidebar: "Collapse sidebar",
    expandSidebar: "Expand sidebar",
    searchPlaceholder: "Search pages and products…",
    searchPages: "Pages",
    searchProducts: "Products",
    searchEmpty: "No matching results",
    accountMenu: "Account menu",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function pickLocalized(
  locale: Locale,
  ar: string | null | undefined,
  en: string | null | undefined,
): string {
  if (locale === "en") return (en && en.trim()) || ar || "";
  return (ar && ar.trim()) || en || "";
}
