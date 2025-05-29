import type { Metadata } from "next";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
