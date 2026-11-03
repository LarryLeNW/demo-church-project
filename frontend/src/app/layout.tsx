import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "SAM • Spiritual Advance Ministry | saministry",
  description:
    "saministry (SAM) - Spiritual Advance Ministry: We are devoted in equipping people. Christian Discipleship, Sunday School LMS, Small Groups, and US 501(c)(3) Online Giving Platform.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/cropped-logo-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/cropped-logo-32.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/cropped-logo-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Cinzel:wght@500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FBF9F5] text-slate-900 antialiased selection:bg-amber-600 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
