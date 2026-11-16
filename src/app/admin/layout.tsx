import { Suspense } from "react";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div dir="rtl" style={{ padding: 24 }}>جاري التحميل...</div>}>{children}</Suspense>;
}
