import type { Metadata } from "next";
import { Cairo } from 'next/font/google';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "عيادة ماي دكتور لطب الأسنان - رعاية متميزة لابتسامة مثالية",
  description: "عيادة ماي دكتور لطب الأسنان تقدم خدمات طب أسنان متكاملة بأحدث التقنيات وعلى يد أمهر الأطباء لنمنحك ابتسامة مثالية تدوم مدى الحياة",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
        />

      </head>
      <body className={`${cairo.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
